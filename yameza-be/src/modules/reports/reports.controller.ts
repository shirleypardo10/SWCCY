import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import { ReportDateRangeDto } from './dto/report-date-range.dto';
import { ReportsService } from './reports.service';
@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}
  @Get('sales') async sales(@Query() q: ReportDateRangeDto) {
    return ok('Reporte de ventas', await this.service.sales(q));
  }
  @Get('production') async production(@Query() q: ReportDateRangeDto) {
    return ok('Reporte de produccion', await this.service.production(q));
  }
  @Get('inventory') async inventory() {
    return ok('Reporte de inventario', await this.service.inventory());
  }
}
