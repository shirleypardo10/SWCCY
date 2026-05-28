import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ok } from 'src/common/utils/api-response';
import {
  PauseProductionDto,
  ResumeProductionDto,
  StartProductionDto,
  UpdateProductionProgressDto,
  UpdateProductionStageDto,
} from './dto/production.dto';
import { ProductionStageName } from './enums/production.enum';
import { ProductionService } from './production.service';
@ApiTags('Production')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.GERENTE, RoleName.PRODUCTOR)
@Controller('production')
export class ProductionController {
  constructor(private readonly service: ProductionService) {}
  @Post('order/:orderId/start') async start(
    @Param('orderId') orderId: string,
    @Body() dto: StartProductionDto,
    @CurrentUser() user: any,
  ) {
    return ok('Produccion iniciada', await this.service.start(orderId, dto, user.id));
  }
  @Get() async all() {
    return ok('Producciones listadas', await this.service.findAll());
  }
  @Get('order/:orderId') async byOrder(@Param('orderId') orderId: string) {
    return ok('Produccion por pedido', await this.service.findByOrder(orderId));
  }
  @Get(':id') async one(@Param('id') id: string) {
    return ok('Produccion obtenida', await this.service.findOne(id));
  }
  @Get(':id/progress') async progress(@Param('id') id: string) {
    return ok('Progreso obtenido', await this.service.progressInfo(id));
  }
  @Patch(':id/pause') async pause(
    @Param('id') id: string,
    @Body() dto: PauseProductionDto,
    @CurrentUser() user: any,
  ) {
    return ok('Produccion pausada', await this.service.pause(id, dto, user.id));
  }
  @Patch(':id/resume') async resume(
    @Param('id') id: string,
    @Body() dto: ResumeProductionDto,
    @CurrentUser() user: any,
  ) {
    return ok('Produccion reanudada', await this.service.resume(id, dto, user.id));
  }
  @Patch(':id/complete') async complete(@Param('id') id: string, @CurrentUser() user: any) {
    return ok('Produccion completada', await this.service.complete(id, user.id));
  }
  @Patch(':productionId/stages/:stageName') async stage(
    @Param('productionId') id: string,
    @Param('stageName') stageName: ProductionStageName,
    @Body() dto: UpdateProductionStageDto,
    @CurrentUser() user: any,
  ) {
    return ok('Etapa actualizada', await this.service.updateStage(id, stageName, dto, user.id));
  }
  @Patch(':id/progress') async updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateProductionProgressDto,
    @CurrentUser() user: any,
  ) {
    return ok(
      'Progreso actualizado',
      await this.service.updateStage(
        id,
        dto.currentStage,
        { status: 'IN_PROGRESS' as any },
        user.id,
      ),
    );
  }
}
