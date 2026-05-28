import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Material, MaterialSchema } from '../materials/schemas/material.schema';
import { OrdersModule } from '../orders/orders.module';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { Quotation, QuotationSchema } from './schemas/quotation.schema';
@Module({
  imports: [
    OrdersModule,
    MongooseModule.forFeature([
      { name: Quotation.name, schema: QuotationSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService, MongooseModule],
})
export class QuotationsModule {}
