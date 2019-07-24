import { TestBed } from '@angular/core/testing';

import { RefundApplicationInfoService } from './refund-application-info.service';

describe('RefundApplicationInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundApplicationInfoService = TestBed.get(RefundApplicationInfoService);
    expect(service).toBeTruthy();
  });
});
