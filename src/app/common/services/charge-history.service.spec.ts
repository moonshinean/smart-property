import { TestBed } from '@angular/core/testing';

import { ChargeHistoryService } from './charge-history.service';

describe('ChargeHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeHistoryService = TestBed.get(ChargeHistoryService);
    expect(service).toBeTruthy();
  });
});
