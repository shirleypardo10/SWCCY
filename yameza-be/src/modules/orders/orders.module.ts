import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from '../customers/customers.module';
import { Material, MaterialSchema } from '../materials/schemas/material.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
@Module({
  imports: [
    CustomersModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
