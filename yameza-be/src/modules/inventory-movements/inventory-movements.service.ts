import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MaterialsService } from '../materials/materials.service';
import { CreateInventoryMovementDto } from './dto/inventory-movement.dto';
import { InventoryMovementType } from './enums/inventory-movement.enum';
import { InventoryMovement } from './schemas/inventory-movement.schema';
@Injectable()
export class InventoryMovementsService {
  constructor(
    @InjectModel(InventoryMovement.name) private readonly model: Model<InventoryMovement>,
    private readonly materials: MaterialsService,
  ) {}
  async create(dto: CreateInventoryMovementDto, userId: string) {
    const material = await this.materials.findOne(dto.materialId);
    const previousStock = material.currentStock;
    const newStock =
      dto.type === InventoryMovementType.IN
        ? previousStock + dto.quantity
        : dto.type === InventoryMovementType.OUT
          ? previousStock - dto.quantity
          : dto.quantity;
    if (newStock < 0) throw new ConflictException('Stock insuficiente');
    await this.materials.updateStock(dto.materialId, newStock);
    return this.model.create({
      ...dto,
      previousStock,
      newStock,
      registeredBy: new Types.ObjectId(userId),
    });
  }
  findAll() {
    return this.model.find().populate('materialId').sort({ createdAt: -1 });
  }
  async findOne(id: string) {
    const item = await this.model.findById(id).populate('materialId');
    if (!item) throw new NotFoundException('Movimiento no encontrado');
    return item;
  }
  findByMaterial(materialId: string) {
    return this.model.find({ materialId }).sort({ createdAt: -1 });
  }
}
