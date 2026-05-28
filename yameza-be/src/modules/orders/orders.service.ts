import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { roundMoney } from 'src/common/utils/api-response';
import { CustomersService } from '../customers/customers.service';
import { Material } from '../materials/schemas/material.schema';
import { CreateOrderDto, OrderFiltersDto, UpdateOrderDto } from './dto/order.dto';
import { OrderStatus } from './enums/order.enum';
import { Order } from './schemas/order.schema';

const transitions: Record<OrderStatus, OrderStatus[]> = {
  REGISTERED: [OrderStatus.QUOTED, OrderStatus.CANCELLED],
  QUOTED: [OrderStatus.APPROVED, OrderStatus.CANCELLED],
  APPROVED: [OrderStatus.IN_PRODUCTION, OrderStatus.CANCELLED],
  IN_PRODUCTION: [
    OrderStatus.PRODUCTION_PAUSED,
    OrderStatus.PRODUCTION_COMPLETED,
    OrderStatus.CANCELLED,
  ],
  PRODUCTION_PAUSED: [OrderStatus.IN_PRODUCTION, OrderStatus.CANCELLED],
  PRODUCTION_COMPLETED: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<Order>,
    @InjectModel(Material.name) private readonly materialModel: Model<Material>,
    private readonly customers: CustomersService,
    private readonly config: ConfigService,
  ) {}
  async create(dto: CreateOrderDto, userId: string) {
    let customerId = dto.customerId;
    if (!customerId && dto.customer)
      customerId = String((await this.customers.create(dto.customer))._id);
    if (!customerId) throw new BadRequestException('Debe asociar o crear un cliente');
    await this.customers.findOne(customerId);
    const subtotal = await this.calculateMaterialCost(dto.materialIds ?? [], dto.quantity);
    const taxAmount = roundMoney(subtotal * (this.config.get<number>('defaultTaxRate') ?? 0.18));
    const totalAmount = roundMoney(subtotal + taxAmount);
    return this.model.create({
      ...dto,
      customerId,
      trackingCode: await this.nextTrackingCode(),
      subtotal,
      taxAmount,
      totalAmount,
      pendingAmount: totalAmount,
      createdBy: new Types.ObjectId(userId),
      status: OrderStatus.REGISTERED,
    });
  }
  async findAll(filters: OrderFiltersDto) {
    const query: FilterQuery<Order> = { isDeleted: false };
    if (filters.customerId) query.customerId = filters.customerId;
    if (filters.status) query.status = filters.status;
    if (filters.furnitureType) query.furnitureType = filters.furnitureType;
    if (filters.trackingCode) query.trackingCode = new RegExp(filters.trackingCode, 'i');
    if (filters.dateFrom || filters.dateTo)
      query.createdAt = {
        ...(filters.dateFrom ? { $gte: new Date(filters.dateFrom) } : {}),
        ...(filters.dateTo ? { $lte: new Date(filters.dateTo) } : {}),
      };
    const page = filters.page ?? 1,
      limit = filters.limit ?? 10;
    const sort = { [filters.sortBy ?? 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 } as any;
    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .populate('customerId')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      this.model.countDocuments(query),
    ]);
    const filtered =
      filters.customerName || filters.documentNumber
        ? data.filter(
            (o: any) =>
              (!filters.customerName ||
                o.customerId?.fullName
                  ?.toLowerCase()
                  .includes(filters.customerName.toLowerCase())) &&
              (!filters.documentNumber ||
                o.customerId?.documentNumber?.includes(filters.documentNumber)),
          )
        : data;
    return { data: filtered, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
  async findOne(id: string) {
    const item = await this.model
      .findOne({ _id: id, isDeleted: false })
      .populate('customerId materialIds');
    if (!item) throw new NotFoundException('Pedido no encontrado');
    return item;
  }
  async findByTracking(trackingCode: string) {
    const item = await this.model.findOne({ trackingCode, isDeleted: false });
    if (!item) throw new NotFoundException('Pedido no encontrado');
    return item;
  }
  async update(id: string, dto: UpdateOrderDto) {
    const item = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Pedido no encontrado');
    return item;
  }
  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    if (!transitions[order.status].includes(status))
      throw new ConflictException(`Transicion invalida ${order.status} -> ${status}`);
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
  async forceStatus(id: string, status: OrderStatus, extra: Record<string, unknown> = {}) {
    return this.model.findByIdAndUpdate(id, { status, ...extra }, { new: true });
  }
  async updateAmounts(
    id: string,
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    quotationId?: string,
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        subtotal,
        taxAmount,
        totalAmount,
        pendingAmount: roundMoney(totalAmount - (await this.findOne(id)).paidAmount),
        ...(quotationId ? { quotationId } : {}),
      },
      { new: true },
    );
  }
  async applyPayment(id: string, amount: number) {
    const order = await this.findOne(id);
    if (amount > order.pendingAmount)
      throw new ConflictException('El pago supera el saldo pendiente');
    const paidAmount = roundMoney(order.paidAmount + amount);
    return this.model.findByIdAndUpdate(
      id,
      { paidAmount, pendingAmount: roundMoney(order.totalAmount - paidAmount) },
      { new: true },
    );
  }
  async balance(id: string) {
    const o = await this.findOne(id);
    return {
      orderId: id,
      totalAmount: o.totalAmount,
      paidAmount: o.paidAmount,
      pendingAmount: o.pendingAmount,
      isFullyPaid: o.pendingAmount <= 0,
    };
  }
  async softDelete(id: string) {
    return this.model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
  private async calculateMaterialCost(ids: string[], quantity: number) {
    if (!ids.length) return 0;
    const materials = await this.materialModel.find({ _id: { $in: ids } });
    return roundMoney(materials.reduce((s, m) => s + m.unitCost, 0) * quantity);
  }
  private async nextTrackingCode() {
    return `SWCCY-${new Date().getFullYear()}-${String((await this.model.countDocuments()) + 1).padStart(6, '0')}`;
  }
}
