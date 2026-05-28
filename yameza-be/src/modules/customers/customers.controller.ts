import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR)
@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}
  @Post() async create(@Body() dto: CreateCustomerDto) {
    return ok('Cliente creado', await this.service.create(dto));
  }
  @Get() async all() {
    return ok('Clientes listados', await this.service.findAll());
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Cliente obtenido', await this.service.findOne(id));
  }
  @Patch(':id') async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return ok('Cliente actualizado', await this.service.update(id, dto));
  }
}
