import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FurnitureType, MeasurementUnit, OrderStatus } from '../enums/order.enum';
export type OrderDocument = HydratedDocument<Order>;
@Schema({ _id: false })
export class Measurements {
  @Prop({ required: true, min: 0 }) width: number;
  @Prop({ required: true, min: 0 }) height: number;
  @Prop({ required: true, min: 0 }) depth: number;
  @Prop({ enum: MeasurementUnit, required: true }) unit: MeasurementUnit;
}
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true }) trackingCode: string;
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true }) customerId: Types.ObjectId;
  @Prop({ enum: FurnitureType, required: true }) furnitureType: FurnitureType;
  @Prop({ required: true, min: 1 }) quantity: number;
  @Prop({ type: Measurements, required: true }) measurements: Measurements;
  @Prop({ type: [Types.ObjectId], ref: 'Material', default: [] }) materialIds: Types.ObjectId[];
  @Prop() observations?: string;
  @Prop({ enum: OrderStatus, default: OrderStatus.REGISTERED }) status: OrderStatus;
  @Prop({ default: 0 }) subtotal: number;
  @Prop({ default: 0 }) taxAmount: number;
  @Prop({ default: 0 }) totalAmount: number;
  @Prop({ default: 0 }) paidAmount: number;
  @Prop({ default: 0 }) pendingAmount: number;
  @Prop({ type: Types.ObjectId, ref: 'Quotation' }) quotationId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Production' }) productionId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Delivery' }) deliveryId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) createdBy: Types.ObjectId;
  @Prop({ default: false }) isDeleted: boolean;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
