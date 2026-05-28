import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private readonly model: Model<Role>) {}
  async create(dto: CreateRoleDto) {
    if (await this.model.exists({ name: dto.name })) throw new ConflictException('Rol duplicado');
    return this.model.create(dto);
  }
  findAll() {
    return this.model.find().sort({ name: 1 });
  }
  async findOne(id: string) {
    const r = await this.model.findById(id);
    if (!r) throw new NotFoundException('Rol no encontrado');
    return r;
  }
  async update(id: string, dto: UpdateRoleDto) {
    const r = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!r) throw new NotFoundException('Rol no encontrado');
    return r;
  }
}
