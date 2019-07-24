import { TestBed } from '@angular/core/testing';

import { ChargeCouponService } from './charge-coupon.service';

describe('ChargeCouponService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeCouponService = TestBed.get(ChargeCouponService);
    expect(service).toBeTruthy();
  });
});
