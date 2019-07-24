import { TestBed } from '@angular/core/testing';

import { BfParcelinfoService } from './bf-parcelinfo.service';

describe('BfParcelinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfParcelinfoService = TestBed.get(BfParcelinfoService);
    expect(service).toBeTruthy();
  });
});
