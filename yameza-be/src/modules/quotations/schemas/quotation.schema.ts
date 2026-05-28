import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QuotationStatus } from '../enums/quotation.enum';
export type QuotationDocument = HydratedDocument<Quotation>;
@Schema({ timestamps: true })
export class Quotation {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true }) orderId: Types.ObjectId;
  @Prop({ required: true, min: 0 }) laborCost: number;
  @Prop({ required: true, min: 0 }) materialsCost: number;
  @Prop({ required: true, min: 0, default: 0 }) additionalCost: number;
  @Prop({ required: true, min: 0 }) subtotal: number;
  @Prop({ required: true, min: 0 }) taxRate: number;
  @Prop({ required: true, min: 0 }) taxAmount: number;
  @Prop({ required: true, min: 0 }) total: number;
  @Prop({ enum: QuotationStatus, default: QuotationStatus.GENERATED }) status: QuotationStatus;
  @Prop() pdfUrl?: string;
  @Prop({ default: Date.now }) generatedAt: Date;
}
export const QuotationSchema = SchemaFactory.createForClass(Quotation);
