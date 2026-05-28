import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { RoleName } from 'src/common/enums/role.enum';

export class CreateRoleDto {
  @ApiProperty({ enum: RoleName, example: RoleName.VENDEDOR })
  @IsEnum(RoleName)
  name: RoleName;

  @ApiProperty({ example: ['orders:read', 'orders:create'] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
