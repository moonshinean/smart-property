import { TestBed } from '@angular/core/testing';

import { ChargePaymentService } from './charge-payment.service';

describe('ChargePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargePaymentService = TestBed.get(ChargePaymentService);
    expect(service).toBeTruthy();
  });
});
