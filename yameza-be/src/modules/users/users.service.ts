import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RoleName } from 'src/common/enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userModel.exists({ email: dto.email.toLowerCase() });
    if (exists) throw new ConflictException('El email ya existe');
    const passwordHash = await bcrypt.hash(
      dto.password,
      this.config.get<number>('bcryptSaltRounds') ?? 10,
    );
    return this.userModel.create({ ...dto, email: dto.email.toLowerCase(), passwordHash });
  }

  findAll() {
    return this.userModel.find().sort({ createdAt: -1 });
  }
  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
  findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  }
  async update(id: string, dto: UpdateUserDto) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.password)
      payload.passwordHash = await bcrypt.hash(
        dto.password,
        this.config.get<number>('bcryptSaltRounds') ?? 10,
      );
    delete payload.password;
    const user = await this.userModel.findByIdAndUpdate(id, payload, { new: true });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
  async updateStatus(id: string, isActive: boolean) {
    return this.update(id, { isActive } as UpdateUserDto);
  }
  async assignRole(id: string, role: RoleName) {
    return this.update(id, { role } as UpdateUserDto);
  }
  async softDelete(id: string) {
    return this.updateStatus(id, false);
  }
}
