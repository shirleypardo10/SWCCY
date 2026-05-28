import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import {
  CreateOrderDto,
  OrderFiltersDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { OrdersService } from './orders.service';
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}
  @Post() @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR) async create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    return ok('Pedido creado', await this.service.create(dto, user.id));
  }
  @Get() @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR, RoleName.PRODUCTOR) async all(
    @Query() q: OrderFiltersDto,
  ) {
    const r = await this.service.findAll(q);
    return ok('Pedidos listados', r.data, r.meta);
  }
  @Get('tracking/:trackingCode')
  @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR, RoleName.PRODUCTOR)
  async tracking(@Param('trackingCode') code: string) {
    return ok('Pedido obtenido', await this.service.findByTracking(code));
  }
  @Get(':id/balance') @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR) async balance(
    @Param('id') id: string,
  ) {
    return ok('Saldo obtenido', await this.service.balance(id));
  }
  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR, RoleName.PRODUCTOR)
  async one(@Param('id') id: string) {
    return ok('Pedido obtenido', await this.service.findOne(id));
  }
  @Patch(':id') @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR) async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return ok('Pedido actualizado', await this.service.update(id, dto));
  }
  @Patch(':id/status')
  @Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR, RoleName.PRODUCTOR)
  async status(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return ok('Estado actualizado', await this.service.updateStatus(id, dto.status));
  }
  @Delete(':id') @Roles(RoleName.ADMIN, RoleName.GERENTE) async remove(@Param('id') id: string) {
    return ok('Pedido eliminado logicamente', await this.service.softDelete(id));
  }
}
