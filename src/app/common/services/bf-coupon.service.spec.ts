import { TestBed } from '@angular/core/testing';

import { BfCouponService } from './bf-coupon.service';

describe('BfCouponService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfCouponService = TestBed.get(BfCouponService);
    expect(service).toBeTruthy();
  });
});
