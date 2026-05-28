import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import appConfig from '../config/app.config';
import databaseConfig from '../config/database.config';
import jwtConfig from '../config/jwt.config';
import { RoleName } from '../common/enums/role.enum';
import { Role, RoleSchema } from '../modules/roles/schemas/role.schema';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { Module } from '@nestjs/common';

const permissions: Record<RoleName, string[]> = {
  ADMIN: ['*'],
  GERENTE: ['reports:*', 'orders:read', 'quotations:*', 'production:*', 'inventory:*'],
  VENDEDOR: ['customers:*', 'orders:*', 'quotations:*', 'payments:*', 'deliveries:*'],
  PRODUCTOR: ['production:*', 'orders:read'],
  ALMACENERO: ['materials:*', 'inventory:*'],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig, jwtConfig] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ uri: c.getOrThrow<string>('database.uri') }),
    }),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
class SeedModule {}

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const roleModel = app.get<Model<Role>>(getModelToken(Role.name));
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  for (const name of Object.values(RoleName)) {
    await roleModel.updateOne({ name }, { name, permissions: permissions[name] }, { upsert: true });
  }
  const passwordHash = await bcrypt.hash('Admin123456', 10);
  await userModel.updateOne(
    { email: 'admin@yameza.com' },
    {
      fullName: 'Administrador YAMEZA',
      email: 'admin@yameza.com',
      passwordHash,
      role: RoleName.ADMIN,
      isActive: true,
    },
    { upsert: true },
  );
  await app.close();
  console.log('Seed ejecutado: roles y admin creados/actualizados.');
}
seed();
