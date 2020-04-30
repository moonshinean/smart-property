import { TestBed } from '@angular/core/testing';

import { ChargeScrappedBillService } from './charge-scrapped-bill.service';

describe('ChargeScrappedBillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeScrappedBillService = TestBed.get(ChargeScrappedBillService);
    expect(service).toBeTruthy();
  });
});
