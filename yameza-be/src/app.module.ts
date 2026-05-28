import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import jwtConfig from './config/jwt.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { InventoryMovementsModule } from './modules/inventory-movements/inventory-movements.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductionModule } from './modules/production/production.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CustomersModule,
    OrdersModule,
    QuotationsModule,
    ProductionModule,
    PaymentsModule,
    DeliveriesModule,
    MaterialsModule,
    InventoryMovementsModule,
    ReportsModule,
  ],
})
export class AppModule {}
