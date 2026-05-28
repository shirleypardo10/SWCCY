import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateCustomerDto } from 'src/modules/customers/dto/customer.dto';
import { FurnitureType, MeasurementUnit, OrderStatus } from '../enums/order.enum';
class MeasurementsDto {
  @ApiProperty({ example: 120 }) @IsNumber() @Min(0.01) width: number;
  @ApiProperty({ example: 180 }) @IsNumber() @Min(0.01) height: number;
  @ApiProperty({ example: 55 }) @IsNumber() @Min(0.01) depth: number;
  @ApiProperty({ enum: MeasurementUnit }) @IsEnum(MeasurementUnit) unit: MeasurementUnit;
}
export class CreateOrderDto {
  @ApiPropertyOptional() @IsOptional() @IsMongoId() customerId?: string;
  @ApiPropertyOptional({ type: CreateCustomerDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer?: CreateCustomerDto;
  @ApiProperty({ enum: FurnitureType }) @IsEnum(FurnitureType) furnitureType: FurnitureType;
  @ApiProperty({ example: 1 }) @IsNumber() @Min(1) quantity: number;
  @ApiProperty({ type: MeasurementsDto })
  @ValidateNested()
  @Type(() => MeasurementsDto)
  measurements: MeasurementsDto;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsMongoId({ each: true })
  materialIds?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() observations?: string;
}
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus }) @IsEnum(OrderStatus) status: OrderStatus;
}
export class OrderFiltersDto extends PaginationDto {
  @IsOptional() @IsMongoId() customerId?: string;
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() documentNumber?: string;
  @IsOptional() @IsEnum(OrderStatus) status?: OrderStatus;
  @IsOptional() @IsEnum(FurnitureType) furnitureType?: FurnitureType;
  @IsOptional() @IsString() trackingCode?: string;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
}
