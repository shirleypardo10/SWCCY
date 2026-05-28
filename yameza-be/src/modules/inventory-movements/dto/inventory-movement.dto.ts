import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { InventoryMovementType, InventoryReferenceType } from '../enums/inventory-movement.enum';
export class CreateInventoryMovementDto {
  @ApiProperty() @IsMongoId() materialId: string;
  @ApiProperty({ enum: InventoryMovementType })
  @IsEnum(InventoryMovementType)
  type: InventoryMovementType;
  @ApiProperty({ example: 5 }) @IsNumber() @Min(0) quantity: number;
  @ApiProperty({ example: 'Compra de material' }) @IsString() reason: string;
  @ApiPropertyOptional({ enum: InventoryReferenceType })
  @IsOptional()
  @IsEnum(InventoryReferenceType)
  referenceType?: InventoryReferenceType;
  @ApiPropertyOptional() @IsOptional() @IsString() referenceId?: string;
}
