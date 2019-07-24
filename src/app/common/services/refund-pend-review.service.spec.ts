import { TestBed } from '@angular/core/testing';

import { RefundPendReviewService } from './refund-pend-review.service';

describe('RefundPendReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundPendReviewService = TestBed.get(RefundPendReviewService);
    expect(service).toBeTruthy();
  });
});
