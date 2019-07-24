import { TestBed } from '@angular/core/testing';

import { RefundReviewService } from './refund-review.service';

describe('RefundReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundReviewService = TestBed.get(RefundReviewService);
    expect(service).toBeTruthy();
  });
});
