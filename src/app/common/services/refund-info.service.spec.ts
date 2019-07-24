import { TestBed } from '@angular/core/testing';

import { RefundInfoService } from './refund-info.service';

describe('RefundInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundInfoService = TestBed.get(RefundInfoService);
    expect(service).toBeTruthy();
  });
});
