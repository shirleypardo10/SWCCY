import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryMovement,
  InventoryMovementSchema,
} from '../inventory-movements/schemas/inventory-movement.schema';
import { Material, MaterialSchema } from '../materials/schemas/material.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Production, ProductionSchema } from '../production/schemas/production.schema';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Production.name, schema: ProductionSchema },
      { name: Material.name, schema: MaterialSchema },
      { name: InventoryMovement.name, schema: InventoryMovementSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
