import { TestBed } from '@angular/core/testing';

import { CouponAuditedService } from './coupon-audited.service';

describe('CouponAuditedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CouponAuditedService = TestBed.get(CouponAuditedService);
    expect(service).toBeTruthy();
  });
});
