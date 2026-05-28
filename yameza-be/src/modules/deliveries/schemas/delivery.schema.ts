import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DeliveryStatus } from '../enums/delivery.enum';
export type DeliveryDocument = HydratedDocument<Delivery>;
@Schema({ timestamps: true })
export class Delivery {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true }) orderId: Types.ObjectId;
  @Prop({ required: true }) deliveryDate: Date;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) responsibleUserId: Types.ObjectId;
  @Prop({ required: true }) receiverName: string;
  @Prop({ required: true }) receiverDocument: string;
  @Prop() confirmationNotes?: string;
  @Prop({ enum: DeliveryStatus, default: DeliveryStatus.DELIVERED }) status: DeliveryStatus;
}
export const DeliverySchema = SchemaFactory.createForClass(Delivery);
