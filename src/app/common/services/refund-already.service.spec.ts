import { TestBed } from '@angular/core/testing';

import { RefundAlreadyService } from './refund-already.service';

describe('RefundAlreadyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefundAlreadyService = TestBed.get(RefundAlreadyService);
    expect(service).toBeTruthy();
  });
});
