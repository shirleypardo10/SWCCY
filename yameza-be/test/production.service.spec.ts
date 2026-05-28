import { ConflictException } from '@nestjs/common';
import { ProductionService } from '../src/modules/production/production.service';
import { OrderStatus } from '../src/modules/orders/enums/order.enum';
import {
  ProductionStageName,
  ProductionStageStatus,
  ProductionStatus,
} from '../src/modules/production/enums/production.enum';

describe('ProductionService', () => {
  it('no completa si hay etapas pendientes', async () => {
    const service = new ProductionService({} as any, {} as any);
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue({ stages: [{ status: ProductionStageStatus.PENDING }] } as any);
    await expect(service.complete('p1', 'u1')).rejects.toBeInstanceOf(ConflictException);
  });
  it('no inicia pedidos cancelados', async () => {
    const service = new ProductionService(
      { exists: jest.fn() } as any,
      { findOne: jest.fn().mockResolvedValue({ status: OrderStatus.CANCELLED }) } as any,
    );
    await expect(service.start('o1', {}, 'u1')).rejects.toBeInstanceOf(ConflictException);
  });
  it('registra historial de pausa con estado anterior real', async () => {
    const service = new ProductionService({} as any, { forceStatus: jest.fn() } as any);
    const production: any = {
      status: ProductionStatus.IN_PROGRESS,
      orderId: '665000000000000000000001',
      history: [],
      save: jest.fn(),
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(production as any);

    await service.pause('p1', { comment: 'Falta herraje' }, '665000000000000000000002');

    expect(production.history[0].fromStatus).toBe(ProductionStatus.IN_PROGRESS);
    expect(production.history[0].toStatus).toBe(ProductionStatus.PAUSED);
  });
  it('no reanuda producciones que no estan pausadas', async () => {
    const service = new ProductionService({} as any, {} as any);
    jest.spyOn(service, 'findOne').mockResolvedValue({ status: ProductionStatus.IN_PROGRESS } as any);

    await expect(service.resume('p1', {}, 'u1')).rejects.toBeInstanceOf(ConflictException);
  });
  it('no actualiza etapas cuando la produccion esta pausada', async () => {
    const service = new ProductionService({} as any, {} as any);
    jest.spyOn(service, 'findOne').mockResolvedValue({ status: ProductionStatus.PAUSED } as any);

    await expect(
      service.updateStage(
        'p1',
        ProductionStageName.CORTE,
        { status: ProductionStageStatus.COMPLETED },
        'u1',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });
  it('no completa producciones pausadas', async () => {
    const service = new ProductionService({} as any, {} as any);
    jest.spyOn(service, 'findOne').mockResolvedValue({
      status: ProductionStatus.PAUSED,
      stages: [{ status: ProductionStageStatus.COMPLETED }],
    } as any);

    await expect(service.complete('p1', 'u1')).rejects.toBeInstanceOf(ConflictException);
  });
});
