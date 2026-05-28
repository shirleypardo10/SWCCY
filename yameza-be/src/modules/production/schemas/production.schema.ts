import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ProductionStageName,
  ProductionStageStatus,
  ProductionStatus,
} from '../enums/production.enum';
export type ProductionDocument = HydratedDocument<Production>;
@Schema({ _id: false })
export class ProductionStage {
  @Prop({ enum: ProductionStageName, required: true }) name: ProductionStageName;
  @Prop({ enum: ProductionStageStatus, default: ProductionStageStatus.PENDING })
  status: ProductionStageStatus;
  @Prop() startedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' }) responsibleUserId?: Types.ObjectId;
  @Prop() observations?: string;
}
@Schema({ _id: false })
export class ProductionHistory {
  @Prop({ required: true }) fromStatus: string;
  @Prop({ required: true }) toStatus: string;
  @Prop() stageName?: string;
  @Prop() comment?: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) changedBy: Types.ObjectId;
  @Prop({ default: Date.now }) changedAt: Date;
}
@Schema({ timestamps: true })
export class Production {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, unique: true })
  orderId: Types.ObjectId;
  @Prop({ enum: ProductionStatus, default: ProductionStatus.PENDING }) status: ProductionStatus;
  @Prop({ enum: ProductionStageName }) currentStage?: ProductionStageName;
  @Prop({ default: 0 }) progressPercentage: number;
  @Prop() startedAt?: Date;
  @Prop() pausedAt?: Date;
  @Prop() resumedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop({ type: [ProductionStage], default: [] }) stages: ProductionStage[];
  @Prop({ type: [ProductionHistory], default: [] }) history: ProductionHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}
export const ProductionSchema = SchemaFactory.createForClass(Production);
