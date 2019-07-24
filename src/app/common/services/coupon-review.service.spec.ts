import { TestBed } from '@angular/core/testing';

import { CouponReviewService } from './coupon-review.service';

describe('CouponReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CouponReviewService = TestBed.get(CouponReviewService);
    expect(service).toBeTruthy();
  });
});
