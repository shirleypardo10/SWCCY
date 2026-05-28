import { ConflictException } from '@nestjs/common';
import { OrdersService } from '../src/modules/orders/orders.service';

describe('PaymentsService rules via OrdersService', () => {
  it('rechaza pago mayor al saldo', async () => {
    const service = new OrdersService(
      { findByIdAndUpdate: jest.fn() } as any,
      {} as any,
      {} as any,
      {} as any,
    );
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue({ pendingAmount: 100, paidAmount: 0, totalAmount: 100 } as any);
    await expect(service.applyPayment('o1', 101)).rejects.toBeInstanceOf(ConflictException);
  });
});
