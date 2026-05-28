import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentType } from './enums/payment.enum';
import { Payment } from './schemas/payment.schema';
@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly model: Model<Payment>,
    private readonly orders: OrdersService,
  ) {}
  async create(dto: CreatePaymentDto, userId: string) {
    const order = await this.orders.findOne(dto.orderId);
    const type = dto.amount >= order.pendingAmount ? PaymentType.TOTAL : PaymentType.PARTIAL;
    await this.orders.applyPayment(dto.orderId, dto.amount);
    return this.model.create({
      ...dto,
      paymentType: type,
      paymentDate: new Date(dto.paymentDate),
      registeredBy: new Types.ObjectId(userId),
    });
  }
  findAll() {
    return this.model.find().populate('orderId').sort({ createdAt: -1 });
  }
  async findOne(id: string) {
    const p = await this.model.findById(id);
    if (!p) throw new NotFoundException('Pago no encontrado');
    return p;
  }
  findByOrder(orderId: string) {
    return this.model.find({ orderId }).sort({ paymentDate: -1 });
  }
}
