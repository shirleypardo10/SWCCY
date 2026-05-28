import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { MaterialsService } from './materials.service';
@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.ALMACENERO)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly service: MaterialsService) {}
  @Post() async create(@Body() dto: CreateMaterialDto) {
    return ok('Material creado', await this.service.create(dto));
  }
  @Get() async all() {
    return ok('Materiales listados', await this.service.findAll());
  }
  @Get('alerts/low-stock') async low() {
    return ok('Materiales con stock bajo', await this.service.lowStock());
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Material obtenido', await this.service.findOne(id));
  }
  @Get(':id/stock') async stock(@Param('id') id: string) {
    const m = await this.service.findOne(id);
    return ok('Stock obtenido', {
      materialId: id,
      currentStock: m.currentStock,
      minimumStock: m.minimumStock,
      isLowStock: m.currentStock <= m.minimumStock,
    });
  }
  @Patch(':id') async update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return ok('Material actualizado', await this.service.update(id, dto));
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return ok('Material desactivado', await this.service.softDelete(id));
  }
}
