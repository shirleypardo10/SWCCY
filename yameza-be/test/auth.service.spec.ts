import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  it('rechaza credenciales invalidas', async () => {
    const service = new AuthService(
      { findByEmailWithPassword: jest.fn().mockResolvedValue(null) } as any,
      {} as any,
    );
    await expect(service.login('x@y.com', 'badpass')).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('devuelve token sin passwordHash', async () => {
    const hash = await bcrypt.hash('Admin123456', 4);
    const user = {
      _id: '1',
      email: 'admin@yameza.com',
      role: 'ADMIN',
      isActive: true,
      passwordHash: hash,
      toJSON: () => ({ _id: '1', email: 'admin@yameza.com', role: 'ADMIN' }),
    };
    const service = new AuthService(
      { findByEmailWithPassword: jest.fn().mockResolvedValue(user) } as any,
      { sign: jest.fn().mockReturnValue('jwt') } as any,
    );
    await expect(service.login('admin@yameza.com', 'Admin123456')).resolves.toMatchObject({
      accessToken: 'jwt',
    });
  });
});
