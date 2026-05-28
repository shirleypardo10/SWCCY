import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment.enum';
export class CreatePaymentDto {
  @ApiProperty() @IsMongoId() orderId: string;
  @ApiProperty({ example: 150 }) @IsNumber() @Min(0.01) amount: number;
  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) method: PaymentMethod;
  @ApiProperty({ example: '2026-05-07' }) @IsDateString() paymentDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() observation?: string;
}
