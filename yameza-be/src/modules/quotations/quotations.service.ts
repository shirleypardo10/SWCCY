import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { roundMoney } from 'src/common/utils/api-response';
import { Material } from '../materials/schemas/material.schema';
import { OrderStatus } from '../orders/enums/order.enum';
import { OrdersService } from '../orders/orders.service';
import { GenerateQuotationDto } from './dto/quotation.dto';
import { QuotationStatus } from './enums/quotation.enum';
import { Quotation } from './schemas/quotation.schema';
@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation.name) private readonly model: Model<Quotation>,
    @InjectModel(Material.name) private readonly materialModel: Model<Material>,
    private readonly orders: OrdersService,
    private readonly config: ConfigService,
  ) {}
  async generate(orderId: string, dto: GenerateQuotationDto) {
    const order = await this.orders.findOne(orderId);
    const materials = await this.materialModel.find({ _id: { $in: order.materialIds } });
    const materialsCost = roundMoney(
      materials.reduce((s, m) => s + m.unitCost, 0) * order.quantity,
    );
    const taxRate = dto.taxRate ?? this.config.get<number>('defaultTaxRate') ?? 0.18;
    const subtotal = roundMoney(materialsCost + dto.laborCost + (dto.additionalCost ?? 0));
    const taxAmount = roundMoney(subtotal * taxRate);
    const total = roundMoney(subtotal + taxAmount);
    const quotation = await this.model.create({
      orderId,
      laborCost: dto.laborCost,
      materialsCost,
      additionalCost: dto.additionalCost ?? 0,
      subtotal,
      taxRate,
      taxAmount,
      total,
    });
    await this.orders.forceStatus(orderId, OrderStatus.QUOTED, {
      subtotal,
      taxAmount,
      totalAmount: total,
      pendingAmount: roundMoney(total - order.paidAmount),
      quotationId: quotation._id,
    });
    return quotation;
  }
  findAll() {
    return this.model.find().populate('orderId').sort({ createdAt: -1 });
  }
  async findOne(id: string) {
    const q = await this.model.findById(id).populate('orderId');
    if (!q) throw new NotFoundException('Cotizacion no encontrada');
    return q;
  }
  async updateStatus(id: string, status: QuotationStatus) {
    const q = await this.model.findByIdAndUpdate(id, { status }, { new: true });
    if (!q) throw new NotFoundException('Cotizacion no encontrada');
    if (status === QuotationStatus.ACCEPTED)
      await this.orders.forceStatus(String(q.orderId), OrderStatus.APPROVED);
    return q;
  }
  async pdf(id: string) {
    const q = await this.findOne(id);
    return { quotationId: id, pdfUrl: q.pdfUrl ?? `/quotations/${id}/pdf`, simulated: true };
  }
}
