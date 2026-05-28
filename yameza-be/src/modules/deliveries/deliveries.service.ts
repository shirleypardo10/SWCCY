import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderStatus } from '../orders/enums/order.enum';
import { OrdersService } from '../orders/orders.service';
import { CreateDeliveryDto } from './dto/delivery.dto';
import { Delivery } from './schemas/delivery.schema';
@Injectable()
export class DeliveriesService {
  constructor(
    @InjectModel(Delivery.name) private readonly model: Model<Delivery>,
    private readonly orders: OrdersService,
    private readonly config: ConfigService,
  ) {}
  async create(dto: CreateDeliveryDto) {
    const order = await this.orders.findOne(dto.orderId);
    if (order.status !== OrderStatus.PRODUCTION_COMPLETED)
      throw new ConflictException('El pedido no esta terminado');
    if (!this.config.get<boolean>('allowDeliveryWithPendingBalance') && order.pendingAmount > 0)
      throw new ConflictException('El pedido tiene saldo pendiente');
    const delivery = await this.model.create({ ...dto, deliveryDate: new Date(dto.deliveryDate) });
    await this.orders.forceStatus(dto.orderId, OrderStatus.DELIVERED, { deliveryId: delivery._id });
    return delivery;
  }
  findAll() {
    return this.model.find().populate('orderId').sort({ createdAt: -1 });
  }
  async findOne(id: string) {
    const d = await this.model.findById(id);
    if (!d) throw new NotFoundException('Entrega no encontrada');
    return d;
  }
  findByOrder(orderId: string) {
    return this.model.findOne({ orderId });
  }
}
