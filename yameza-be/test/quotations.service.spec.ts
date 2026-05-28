import { QuotationsService } from '../src/modules/quotations/quotations.service';

describe('QuotationsService', () => {
  it('calcula cotizacion y actualiza pedido', async () => {
    const orders: any = {
      findOne: jest.fn().mockResolvedValue({ materialIds: ['m'], quantity: 2, paidAmount: 0 }),
      forceStatus: jest.fn(),
    };
    const service = new QuotationsService(
      { create: jest.fn((x) => ({ ...x, _id: 'q1' })) } as any,
      { find: jest.fn().mockResolvedValue([{ unitCost: 10 }]) } as any,
      orders,
      { get: jest.fn().mockReturnValue(0.18) } as any,
    );
    const q: any = await service.generate('o1', { laborCost: 100 });
    expect(q.total).toBe(141.6);
    expect(orders.forceStatus).toHaveBeenCalled();
  });
});
