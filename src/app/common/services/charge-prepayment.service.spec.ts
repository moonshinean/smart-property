import { TestBed } from '@angular/core/testing';

import { ChargePrepaymentService } from './charge-prepayment.service';

describe('ChargePrepaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargePrepaymentService = TestBed.get(ChargePrepaymentService);
    expect(service).toBeTruthy();
  });
});
