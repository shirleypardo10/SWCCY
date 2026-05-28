import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { normalizeName } from 'src/common/utils/api-response';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { Material } from './schemas/material.schema';
@Injectable()
export class MaterialsService {
  constructor(@InjectModel(Material.name) private readonly model: Model<Material>) {}
  async create(dto: CreateMaterialDto) {
    const normalizedName = normalizeName(dto.name);
    if (await this.model.exists({ normalizedName }))
      throw new ConflictException('Material duplicado');
    return this.model.create({ ...dto, normalizedName });
  }
  findAll() {
    return this.model.find({ isActive: true }).sort({ name: 1 });
  }
  lowStock() {
    return this.model.find({ isActive: true, $expr: { $lte: ['$currentStock', '$minimumStock'] } });
  }
  async findOne(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Material no encontrado');
    return item;
  }
  async update(id: string, dto: UpdateMaterialDto) {
    const payload = { ...dto, ...(dto.name ? { normalizedName: normalizeName(dto.name) } : {}) };
    const item = await this.model.findByIdAndUpdate(id, payload, { new: true });
    if (!item) throw new NotFoundException('Material no encontrado');
    return item;
  }
  async updateStock(id: string, stock: number) {
    const item = await this.model.findByIdAndUpdate(id, { currentStock: stock }, { new: true });
    if (!item) throw new NotFoundException('Material no encontrado');
    return item;
  }
  async softDelete(id: string) {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}
