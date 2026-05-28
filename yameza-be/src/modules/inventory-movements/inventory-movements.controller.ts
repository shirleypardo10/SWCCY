import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { CreateInventoryMovementDto } from './dto/inventory-movement.dto';
import { InventoryMovementsService } from './inventory-movements.service';
@ApiTags('Inventory Movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.ALMACENERO)
@Controller('inventory-movements')
export class InventoryMovementsController {
  constructor(private readonly service: InventoryMovementsService) {}
  @Post() async create(@Body() dto: CreateInventoryMovementDto, @CurrentUser() user: any) {
    return ok('Movimiento registrado', await this.service.create(dto, user.id));
  }
  @Get() async all() {
    return ok('Movimientos listados', await this.service.findAll());
  }
  @Get('material/:materialId') async byMaterial(@Param('materialId') materialId: string) {
    return ok('Movimientos por material', await this.service.findByMaterial(materialId));
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Movimiento obtenido', await this.service.findOne(id));
  }
}
