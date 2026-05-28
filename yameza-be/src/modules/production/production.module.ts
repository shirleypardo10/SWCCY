import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from '../orders/orders.module';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { Production, ProductionSchema } from './schemas/production.schema';
@Module({
  imports: [
    OrdersModule,
    MongooseModule.forFeature([{ name: Production.name, schema: ProductionSchema }]),
  ],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService, MongooseModule],
})
export class ProductionModule {}
