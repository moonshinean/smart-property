import { TestBed } from '@angular/core/testing';

import { ChargeDetailsService } from './charge-details.service';

describe('ChargeDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeDetailsService = TestBed.get(ChargeDetailsService);
    expect(service).toBeTruthy();
  });
});
