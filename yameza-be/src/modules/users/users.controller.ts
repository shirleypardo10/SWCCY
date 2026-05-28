import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { AssignRoleDto, CreateUserDto, UpdateUserDto, UpdateUserStatusDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Post()
  @Roles(RoleName.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return ok('Usuario creado', await this.service.create(dto));
  }
  @Get()
  @Roles(RoleName.ADMIN, RoleName.GERENTE)
  async findAll() {
    return ok('Usuarios listados', await this.service.findAll());
  }
  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.GERENTE)
  async findOne(@Param('id') id: string) {
    return ok('Usuario obtenido', await this.service.findById(id));
  }
  @Patch(':id')
  @Roles(RoleName.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return ok('Usuario actualizado', await this.service.update(id, dto));
  }
  @Patch(':id/status')
  @Roles(RoleName.ADMIN)
  async status(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return ok('Estado actualizado', await this.service.updateStatus(id, dto.isActive));
  }
  @Patch(':id/role')
  @Roles(RoleName.ADMIN)
  async role(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return ok('Rol asignado', await this.service.assignRole(id, dto.role));
  }
  @Delete(':id')
  @Roles(RoleName.ADMIN)
  async remove(@Param('id') id: string) {
    return ok('Usuario desactivado', await this.service.softDelete(id));
  }
}
