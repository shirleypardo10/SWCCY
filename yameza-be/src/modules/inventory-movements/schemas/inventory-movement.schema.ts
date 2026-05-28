import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { InventoryMovementType, InventoryReferenceType } from '../enums/inventory-movement.enum';
export type InventoryMovementDocument = HydratedDocument<InventoryMovement>;
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class InventoryMovement {
  @Prop({ type: Types.ObjectId, ref: 'Material', required: true }) materialId: Types.ObjectId;
  @Prop({ enum: InventoryMovementType, required: true }) type: InventoryMovementType;
  @Prop({ required: true, min: 0 }) quantity: number;
  @Prop({ required: true, min: 0 }) previousStock: number;
  @Prop({ required: true, min: 0 }) newStock: number;
  @Prop({ required: true }) reason: string;
  @Prop({ enum: InventoryReferenceType }) referenceType?: InventoryReferenceType;
  @Prop() referenceId?: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) registeredBy: Types.ObjectId;
}
export const InventoryMovementSchema = SchemaFactory.createForClass(InventoryMovement);
