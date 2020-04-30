import { TestBed } from '@angular/core/testing';

import { ChargeEmptyCostService } from './charge-empty-cost.service';

describe('ChargeEmptyCostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeEmptyCostService = TestBed.get(ChargeEmptyCostService);
    expect(service).toBeTruthy();
  });
});
