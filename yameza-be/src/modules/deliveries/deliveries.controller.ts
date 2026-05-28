import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { CreateDeliveryDto } from './dto/delivery.dto';
import { DeliveriesService } from './deliveries.service';
@ApiTags('Deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR)
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly service: DeliveriesService) {}
  @Post() async create(@Body() dto: CreateDeliveryDto) {
    return ok('Entrega registrada', await this.service.create(dto));
  }
  @Get() async all() {
    return ok('Entregas listadas', await this.service.findAll());
  }
  @Get('order/:orderId') async byOrder(@Param('orderId') orderId: string) {
    return ok('Entrega por pedido', await this.service.findByOrder(orderId));
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Entrega obtenida', await this.service.findOne(id));
  }
}
