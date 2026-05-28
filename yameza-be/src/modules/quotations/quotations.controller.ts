import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { GenerateQuotationDto, UpdateQuotationStatusDto } from './dto/quotation.dto';
import { QuotationsService } from './quotations.service';
@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.VENDEDOR)
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly service: QuotationsService) {}
  @Post('order/:orderId/generate') async generate(
    @Param('orderId') orderId: string,
    @Body() dto: GenerateQuotationDto,
  ) {
    return ok('Cotizacion generada', await this.service.generate(orderId, dto));
  }
  @Get() async all() {
    return ok('Cotizaciones listadas', await this.service.findAll());
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Cotizacion obtenida', await this.service.findOne(id));
  }
  @Patch(':id/status') async status(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationStatusDto,
  ) {
    return ok('Estado actualizado', await this.service.updateStatus(id, dto.status));
  }
  @Get(':id/pdf') async pdf(@Param('id') id: string) {
    return ok('PDF simulado', await this.service.pdf(id));
  }
}
