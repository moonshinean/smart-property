import { TestBed } from '@angular/core/testing';

import { CouponPendingReviewService } from './coupon-pending-review.service';

describe('CouponPendingReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CouponPendingReviewService = TestBed.get(CouponPendingReviewService);
    expect(service).toBeTruthy();
  });
});
