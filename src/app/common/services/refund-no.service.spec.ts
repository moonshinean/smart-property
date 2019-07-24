import { TestBed } from '@angular/core/testing';

import { RefundNoService } from './refund-no.service';

describe('RefundNoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundNoService = TestBed.get(RefundNoService);
    expect(service).toBeTruthy();
  });
});
