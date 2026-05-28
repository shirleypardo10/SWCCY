import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentsService } from './payments.service';
@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}
  @Post() async create(@Body() dto: CreatePaymentDto, @CurrentUser() user: any) {
    return ok('Pago registrado', await this.service.create(dto, user.id));
  }
  @Get() async all() {
    return ok('Pagos listados', await this.service.findAll());
  }
  @Get('order/:orderId') async byOrder(@Param('orderId') orderId: string) {
    return ok('Pagos por pedido', await this.service.findByOrder(orderId));
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Pago obtenido', await this.service.findOne(id));
  }
}
