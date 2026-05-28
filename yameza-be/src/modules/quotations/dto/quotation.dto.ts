import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { QuotationStatus } from '../enums/quotation.enum';
export class GenerateQuotationDto {
  @ApiProperty({ example: 250 }) @IsNumber() @Min(0) laborCost: number;
  @ApiPropertyOptional({ example: 30 }) @IsOptional() @IsNumber() @Min(0) additionalCost?: number;
  @ApiPropertyOptional({ example: 0.18 }) @IsOptional() @IsNumber() @Min(0) taxRate?: number;
}
export class UpdateQuotationStatusDto {
  @ApiProperty({ enum: QuotationStatus }) @IsEnum(QuotationStatus) status: QuotationStatus;
}
