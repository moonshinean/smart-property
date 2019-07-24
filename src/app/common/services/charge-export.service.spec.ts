import { TestBed } from '@angular/core/testing';

import { ChargeExportService } from './charge-export.service';

describe('ChargeExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeExportService = TestBed.get(ChargeExportService);
    expect(service).toBeTruthy();
  });
});
