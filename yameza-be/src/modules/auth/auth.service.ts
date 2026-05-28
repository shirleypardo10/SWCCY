import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.users.create(dto);
    return this.buildAuthResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales invalidas');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales invalidas');
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: any) {
    const payload = { sub: String(user._id), email: user.email, role: user.role };
    const clean = user.toJSON ? user.toJSON() : user;
    delete clean.passwordHash;
    return { accessToken: this.jwt.sign(payload), user: clean };
  }
}
