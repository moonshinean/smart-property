import { TestBed } from '@angular/core/testing';

import { BfProjectinfoService } from './bf-projectinfo.service';

describe('BfProjectinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfProjectinfoService = TestBed.get(BfProjectinfoService);
    expect(service).toBeTruthy();
  });
});
