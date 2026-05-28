import { ConflictException } from '@nestjs/common';
import { MaterialsService } from '../src/modules/materials/materials.service';
import { MaterialUnit } from '../src/modules/materials/enums/material.enum';

describe('MaterialsService', () => {
  it('evita duplicados por nombre normalizado', async () => {
    const service = new MaterialsService({ exists: jest.fn().mockResolvedValue(true) } as any);
    await expect(
      service.create({
        name: 'Melamina',
        unit: MaterialUnit.BOARD,
        currentStock: 1,
        minimumStock: 1,
        unitCost: 1,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
