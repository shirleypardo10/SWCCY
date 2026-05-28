import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MaterialUnit } from '../enums/material.enum';
export type MaterialDocument = HydratedDocument<Material>;
@Schema({ timestamps: true })
export class Material {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, unique: true }) normalizedName: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ enum: MaterialUnit, required: true }) unit: MaterialUnit;
  @Prop({ required: true, min: 0, default: 0 }) currentStock: number;
  @Prop({ required: true, min: 0, default: 0 }) minimumStock: number;
  @Prop({ required: true, min: 0, default: 0 }) unitCost: number;
  @Prop({ default: true }) isActive: boolean;
}
export const MaterialSchema = SchemaFactory.createForClass(Material);
