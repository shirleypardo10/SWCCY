import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';
export class CreateDeliveryDto {
  @ApiProperty() @IsMongoId() orderId: string;
  @ApiProperty({ example: '2026-05-07' }) @IsDateString() deliveryDate: string;
  @ApiProperty() @IsMongoId() responsibleUserId: string;
  @ApiProperty({ example: 'Juan Perez' }) @IsString() receiverName: string;
  @ApiProperty({ example: '74253618' }) @IsString() receiverDocument: string;
  @ApiPropertyOptional() @IsOptional() @IsString() confirmationNotes?: string;
}
