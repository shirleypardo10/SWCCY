import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from '../orders/orders.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { Delivery, DeliverySchema } from './schemas/delivery.schema';
@Module({
  imports: [
    OrdersModule,
    MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }]),
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
