import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ProductionStageName, ProductionStageStatus } from '../enums/production.enum';
export class StartProductionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
export class UpdateProductionStageDto {
  @ApiProperty({ enum: ProductionStageStatus })
  @IsEnum(ProductionStageStatus)
  status: ProductionStageStatus;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() responsibleUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() observations?: string;
}
export class PauseProductionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
export class ResumeProductionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
export class UpdateProductionProgressDto {
  @ApiProperty({ enum: ProductionStageName })
  @IsEnum(ProductionStageName)
  currentStage: ProductionStageName;
}
