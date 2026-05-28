import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleName } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Administrador Yameza' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'admin@yameza.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin123456' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: RoleName })
  @IsEnum(RoleName)
  role: RoleName;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class UpdateUserStatusDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}

export class AssignRoleDto {
  @ApiProperty({ enum: RoleName })
  @IsEnum(RoleName)
  role: RoleName;
}
