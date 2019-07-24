import { TestBed } from '@angular/core/testing';

import { CouponTotalService } from './coupon-total.service';

describe('CouponTotalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CouponTotalService = TestBed.get(CouponTotalService);
    expect(service).toBeTruthy();
  });
});
