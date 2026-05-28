import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleName } from 'src/common/enums/role.enum';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ enum: RoleName, required: true, unique: true })
  name: RoleName;

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
