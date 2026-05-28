import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ok } from 'src/common/utils/api-response';
import { CreateUserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('login') async login(@Body() dto: LoginDto) {
    return ok('Login exitoso', await this.service.login(dto.email, dto.password));
  }
  @Post('register') async register(@Body() dto: CreateUserDto) {
    return ok('Usuario registrado', await this.service.register(dto));
  }
  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user: unknown) {
    return ok('Perfil autenticado', user);
  }
  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  refresh(@CurrentUser() user: any) {
    return ok('Token vigente', { user });
  }
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  logout() {
    return ok('Sesion cerrada', null);
  }
}
