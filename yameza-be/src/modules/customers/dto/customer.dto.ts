import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../schemas/customer.schema';

export class CreateCustomerDto {
  @ApiProperty({ enum: DocumentType }) @IsEnum(DocumentType) documentType: DocumentType;
  @ApiProperty({ example: '74253618' }) @IsString() documentNumber: string;
  @ApiProperty({ example: 'Juan Perez' }) @IsString() fullName: string;
  @ApiProperty({ example: '987654321' }) @IsString() phone: string;
  @ApiPropertyOptional({ example: 'cliente@mail.com' }) @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional({ example: 'Lima, Peru' }) @IsOptional() @IsString() address?: string;
}
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
