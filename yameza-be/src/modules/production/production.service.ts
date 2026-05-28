import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderStatus } from '../orders/enums/order.enum';
import { OrdersService } from '../orders/orders.service';
import {
  PauseProductionDto,
  ResumeProductionDto,
  StartProductionDto,
  UpdateProductionStageDto,
} from './dto/production.dto';
import {
  ProductionStageName,
  ProductionStageStatus,
  ProductionStatus,
} from './enums/production.enum';
import { Production } from './schemas/production.schema';
@Injectable()
export class ProductionService {
  constructor(
    @InjectModel(Production.name) private readonly model: Model<Production>,
    private readonly orders: OrdersService,
  ) {}
  async start(orderId: string, dto: StartProductionDto, userId: string) {
    const order = await this.orders.findOne(orderId);
    if (![OrderStatus.APPROVED, OrderStatus.QUOTED].includes(order.status))
      throw new ConflictException('El pedido no puede iniciar produccion');
    if (await this.model.exists({ orderId })) throw new ConflictException('Produccion ya iniciada');
    const stages = Object.values(ProductionStageName).map((name) => ({
      name,
      status: ProductionStageStatus.PENDING,
    }));
    const production = await this.model.create({
      orderId,
      status: ProductionStatus.IN_PROGRESS,
      currentStage: ProductionStageName.CORTE,
      progressPercentage: 0,
      startedAt: new Date(),
      stages,
      history: [this.history('PENDING', 'IN_PROGRESS', userId, dto.comment)],
    });
    await this.orders.forceStatus(orderId, OrderStatus.IN_PRODUCTION, {
      productionId: production._id,
    });
    return production;
  }
  findAll() {
    return this.model.find().populate('orderId').sort({ createdAt: -1 });
  }
  async findOne(id: string) {
    const p = await this.model.findById(id).populate('orderId');
    if (!p) throw new NotFoundException('Produccion no encontrada');
    return p;
  }
  async findByOrder(orderId: string) {
    const p = await this.model.findOne({ orderId });
    if (!p) throw new NotFoundException('Produccion no encontrada');
    return p;
  }
  async pause(id: string, dto: PauseProductionDto, userId: string) {
    const p = await this.findOne(id);
    if (p.status !== ProductionStatus.IN_PROGRESS)
      throw new ConflictException('Solo se puede pausar una produccion en curso');
    const from = p.status;
    p.status = ProductionStatus.PAUSED;
    p.pausedAt = new Date();
    p.history.push(this.history(from, ProductionStatus.PAUSED, userId, dto.comment));
    await p.save();
    await this.orders.forceStatus(
      String((p.orderId as any)._id ?? p.orderId),
      OrderStatus.PRODUCTION_PAUSED,
    );
    return p;
  }
  async resume(id: string, dto: ResumeProductionDto, userId: string) {
    const p = await this.findOne(id);
    if (p.status !== ProductionStatus.PAUSED)
      throw new ConflictException('Solo se puede reanudar una produccion pausada');
    p.status = ProductionStatus.IN_PROGRESS;
    p.resumedAt = new Date();
    p.history.push(this.history(ProductionStatus.PAUSED, ProductionStatus.IN_PROGRESS, userId, dto.comment));
    await p.save();
    await this.orders.forceStatus(
      String((p.orderId as any)._id ?? p.orderId),
      OrderStatus.IN_PRODUCTION,
    );
    return p;
  }
  async updateStage(
    id: string,
    stageName: ProductionStageName,
    dto: UpdateProductionStageDto,
    userId: string,
  ) {
    const p = await this.findOne(id);
    if (p.status === ProductionStatus.COMPLETED)
      throw new ConflictException('La produccion ya fue completada');
    if (p.status === ProductionStatus.PAUSED)
      throw new ConflictException('No se pueden actualizar etapas de una produccion pausada');
    const stage = p.stages.find((s) => s.name === stageName);
    if (!stage) throw new NotFoundException('Etapa no encontrada');
    const from = stage.status;
    stage.status = dto.status;
    stage.observations = dto.observations;
    if (dto.responsibleUserId) stage.responsibleUserId = new Types.ObjectId(dto.responsibleUserId);
    if (dto.status === ProductionStageStatus.IN_PROGRESS) stage.startedAt = new Date();
    if (dto.status === ProductionStageStatus.COMPLETED) stage.completedAt = new Date();
    p.currentStage = stageName;
    p.progressPercentage = this.progress(p.stages);
    p.history.push(this.history(from, dto.status, userId, dto.observations, stageName));
    await p.save();
    return p;
  }
  async complete(id: string, userId: string) {
    const p = await this.findOne(id);
    if (p.status === ProductionStatus.COMPLETED)
      throw new ConflictException('La produccion ya fue completada');
    if (p.status === ProductionStatus.PAUSED)
      throw new ConflictException('No se puede completar una produccion pausada');
    if (p.stages.some((s) => s.status !== ProductionStageStatus.COMPLETED))
      throw new ConflictException('No se puede completar con etapas pendientes');
    p.status = ProductionStatus.COMPLETED;
    p.progressPercentage = 100;
    p.completedAt = new Date();
    p.history.push(this.history('IN_PROGRESS', 'COMPLETED', userId));
    await p.save();
    await this.orders.forceStatus(
      String((p.orderId as any)._id ?? p.orderId),
      OrderStatus.PRODUCTION_COMPLETED,
    );
    return p;
  }
  async progressInfo(id: string) {
    const p = await this.findOne(id);
    return {
      productionId: id,
      progressPercentage: p.progressPercentage,
      currentStage: p.currentStage,
      stages: p.stages,
    };
  }
  private progress(stages: any[]) {
    return Math.round(
      (stages.filter((s) => s.status === ProductionStageStatus.COMPLETED).length / stages.length) *
        100,
    );
  }
  private history(
    fromStatus: string,
    toStatus: string,
    userId: string,
    comment?: string,
    stageName?: string,
  ) {
    return {
      fromStatus,
      toStatus,
      stageName,
      comment,
      changedBy: new Types.ObjectId(userId),
      changedAt: new Date(),
    };
  }
}
