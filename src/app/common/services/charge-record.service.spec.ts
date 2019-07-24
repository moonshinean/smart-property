import { TestBed } from '@angular/core/testing';

import { ChargeRecordService } from './charge-record.service';

describe('ChargeRecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeRecordService = TestBed.get(ChargeRecordService);
    expect(service).toBeTruthy();
  });
});
