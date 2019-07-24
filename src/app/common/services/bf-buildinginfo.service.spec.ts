import { TestBed } from '@angular/core/testing';

import { BfBuildinginfoService } from './bf-buildinginfo.service';

describe('BfBuildinginfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfBuildinginfoService = TestBed.get(BfBuildinginfoService);
    expect(service).toBeTruthy();
  });
});
