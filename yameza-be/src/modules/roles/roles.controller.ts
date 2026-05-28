import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}
  @Post() async create(@Body() dto: CreateRoleDto) {
    return ok('Rol creado', await this.service.create(dto));
  }
  @Get() async all() {
    return ok('Roles listados', await this.service.findAll());
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Rol obtenido', await this.service.findOne(id));
  }
  @Patch(':id') async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return ok('Rol actualizado', await this.service.update(id, dto));
  }
}
