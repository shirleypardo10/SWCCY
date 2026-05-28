import { BadRequestException, ConflictException } from '@nestjs/common';
import { OrdersService } from '../src/modules/orders/orders.service';
import {
  FurnitureType,
  MeasurementUnit,
  OrderStatus,
} from '../src/modules/orders/enums/order.enum';

describe('OrdersService', () => {
  const model: any = {
    countDocuments: jest.fn().mockResolvedValue(0),
    create: jest.fn((x) => x),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };
  const service = new OrdersService(
    model,
    { find: jest.fn().mockResolvedValue([]) } as any,
    { create: jest.fn(), findOne: jest.fn() } as any,
    { get: jest.fn().mockReturnValue(0.18) } as any,
  );
  it('no permite pedido sin cliente', async () => {
    await expect(
      service.create(
        {
          furnitureType: FurnitureType.ROPERO,
          quantity: 1,
          measurements: { width: 1, height: 1, depth: 1, unit: MeasurementUnit.M },
          materialIds: [],
        },
        'u',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it('rechaza transicion invalida', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({ status: OrderStatus.REGISTERED } as any);
    await expect(service.updateStatus('id', OrderStatus.DELIVERED)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
