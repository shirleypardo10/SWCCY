import { ConflictException } from '@nestjs/common';
import { InventoryMovementType } from '../src/modules/inventory-movements/enums/inventory-movement.enum';
import { InventoryMovementsService } from '../src/modules/inventory-movements/inventory-movements.service';

describe('InventoryMovementsService', () => {
  it('no permite stock negativo', async () => {
    const service = new InventoryMovementsService(
      {} as any,
      { findOne: jest.fn().mockResolvedValue({ currentStock: 2 }) } as any,
    );
    await expect(
      service.create(
        {
          materialId: '507f1f77bcf86cd799439011',
          type: InventoryMovementType.OUT,
          quantity: 3,
          reason: 'uso',
        },
        '507f1f77bcf86cd799439012',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
