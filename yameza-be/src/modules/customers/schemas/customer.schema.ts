import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum DocumentType {
  DNI = 'DNI',
  RUC = 'RUC',
}
export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ enum: DocumentType, required: true }) documentType: DocumentType;
  @Prop({ required: true, unique: true, trim: true }) documentNumber: string;
  @Prop({ required: true, trim: true }) fullName: string;
  @Prop({ required: true, trim: true }) phone: string;
  @Prop({ trim: true }) email?: string;
  @Prop({ trim: true }) address?: string;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
