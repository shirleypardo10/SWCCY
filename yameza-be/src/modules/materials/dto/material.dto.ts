import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MaterialUnit } from '../enums/material.enum';
export class CreateMaterialDto {
  @ApiProperty({ example: 'Melamina blanca 18mm' }) @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: MaterialUnit }) @IsEnum(MaterialUnit) unit: MaterialUnit;
  @ApiProperty({ example: 20 }) @IsNumber() @Min(0) currentStock: number;
  @ApiProperty({ example: 5 }) @IsNumber() @Min(0) minimumStock: number;
  @ApiProperty({ example: 85.5 }) @IsNumber() @Min(0) unitCost: number;
}
export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {}
