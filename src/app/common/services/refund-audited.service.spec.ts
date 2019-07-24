import { TestBed } from '@angular/core/testing';

import { RefundAuditedService } from './refund-audited.service';

describe('RefundAuditedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundAuditedService = TestBed.get(RefundAuditedService);
    expect(service).toBeTruthy();
  });
});
