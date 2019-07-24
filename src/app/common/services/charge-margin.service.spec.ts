import { TestBed } from '@angular/core/testing';

import { ChargeMarginService } from './charge-margin.service';

describe('ChargeMarginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeMarginService = TestBed.get(ChargeMarginService);
    expect(service).toBeTruthy();
  });
});
