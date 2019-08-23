import { TestBed } from '@angular/core/testing';

import { LatePaymentService } from './late-payment.service';

describe('LatePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LatePaymentService = TestBed.get(LatePaymentService);
    expect(service).toBeTruthy();
  });
});
