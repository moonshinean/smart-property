import { TestBed } from '@angular/core/testing';

import { BfOwnerService } from './bf-owner.service';

describe('BfOwnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfOwnerService = TestBed.get(BfOwnerService);
    expect(service).toBeTruthy();
  });
});
