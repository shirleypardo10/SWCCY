import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryMovementType } from '../inventory-movements/enums/inventory-movement.enum';
import { InventoryMovement } from '../inventory-movements/schemas/inventory-movement.schema';
import { Material } from '../materials/schemas/material.schema';
import { Order } from '../orders/schemas/order.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { ProductionStageName, ProductionStatus } from '../production/enums/production.enum';
import { Production } from '../production/schemas/production.schema';
import { ReportDateRangeDto } from './dto/report-date-range.dto';
@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orders: Model<Order>,
    @InjectModel(Payment.name) private payments: Model<Payment>,
    @InjectModel(Production.name) private productions: Model<Production>,
    @InjectModel(Material.name) private materials: Model<Material>,
    @InjectModel(InventoryMovement.name) private movements: Model<InventoryMovement>,
  ) {}
  private dateQuery(q: ReportDateRangeDto) {
    return q.dateFrom || q.dateTo
      ? {
          createdAt: {
            ...(q.dateFrom ? { $gte: new Date(q.dateFrom) } : {}),
            ...(q.dateTo ? { $lte: new Date(q.dateTo) } : {}),
          },
        }
      : {};
  }
  async sales(q: ReportDateRangeDto) {
    const orders = await this.orders.find(this.dateQuery(q));
    const payments = await this.payments.find(this.dateQuery(q));
    return {
      totalOrders: orders.length,
      totalSalesAmount: orders.reduce((s, o) => s + o.totalAmount, 0),
      totalPaidAmount: orders.reduce((s, o) => s + o.paidAmount, 0),
      totalPendingAmount: orders.reduce((s, o) => s + o.pendingAmount, 0),
      salesByStatus: this.countBy(orders, 'status'),
      salesByFurnitureType: this.countBy(orders, 'furnitureType'),
      paymentsByMethod: this.countBy(payments, 'method'),
    };
  }
  async production(q: ReportDateRangeDto) {
    const p = await this.productions.find(this.dateQuery(q));
    const avg = p.length ? p.reduce((s, x) => s + x.progressPercentage, 0) / p.length : 0;
    const productionsByStage = Object.fromEntries(
      Object.values(ProductionStageName).map((stage) => [
        stage,
        p.filter((x) => x.currentStage === stage).length,
      ]),
    );
    return {
      totalProductions: p.length,
      pendingProductions: p.filter((x) => x.status === ProductionStatus.PENDING).length,
      inProgressProductions: p.filter((x) => x.status === ProductionStatus.IN_PROGRESS).length,
      pausedProductions: p.filter((x) => x.status === ProductionStatus.PAUSED).length,
      completedProductions: p.filter((x) => x.status === ProductionStatus.COMPLETED).length,
      averageProgress: avg,
      productionsByStage,
      delayedProductions: p.filter(
        (x) =>
          x.status !== ProductionStatus.COMPLETED &&
          x.createdAt &&
          Date.now() - new Date(x.createdAt).getTime() > 7 * 86400000,
      ).length,
    };
  }
  async inventory() {
    const materials = await this.materials.find({ isActive: true });
    const movements = await this.movements.find();
    return {
      totalMaterials: materials.length,
      totalInventoryValue: materials.reduce((s, m) => s + m.currentStock * m.unitCost, 0),
      lowStockMaterials: materials.filter((m) => m.currentStock <= m.minimumStock),
      stockByMaterial: materials.map((m) => ({
        materialId: m._id,
        name: m.name,
        currentStock: m.currentStock,
        minimumStock: m.minimumStock,
        unitCost: m.unitCost,
      })),
      movementsByType: Object.fromEntries(
        Object.values(InventoryMovementType).map((t) => [
          t,
          movements.filter((m) => m.type === t).length,
        ]),
      ),
    };
  }
  private countBy(items: any[], key: string) {
    return items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] ?? 0) + 1 }), {});
  }
}
