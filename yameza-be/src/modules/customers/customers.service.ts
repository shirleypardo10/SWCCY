import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private readonly model: Model<Customer>) {}
  async create(dto: CreateCustomerDto) {
    if (await this.model.exists({ documentNumber: dto.documentNumber }))
      throw new ConflictException('Cliente duplicado');
    return this.model.create(dto);
  }
  findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }
  async findOne(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Cliente no encontrado');
    return item;
  }
  async update(id: string, dto: UpdateCustomerDto) {
    const item = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Cliente no encontrado');
    return item;
  }
}
