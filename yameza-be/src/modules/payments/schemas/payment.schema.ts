import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentMethod, PaymentType } from '../enums/payment.enum';
export type PaymentDocument = HydratedDocument<Payment>;
@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true }) orderId: Types.ObjectId;
  @Prop({ required: true, min: 0 }) amount: number;
  @Prop({ enum: PaymentMethod, required: true }) method: PaymentMethod;
  @Prop({ enum: PaymentType, required: true }) paymentType: PaymentType;
  @Prop({ required: true }) paymentDate: Date;
  @Prop() observation?: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) registeredBy: Types.ObjectId;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
