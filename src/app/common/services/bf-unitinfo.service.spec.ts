import { TestBed } from '@angular/core/testing';

import { BfUnitinfoService } from './bf-unitinfo.service';

describe('BfUnitinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfUnitinfoService = TestBed.get(BfUnitinfoService);
    expect(service).toBeTruthy();
  });
});
