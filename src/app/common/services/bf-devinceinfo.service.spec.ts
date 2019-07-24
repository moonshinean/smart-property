import { TestBed } from '@angular/core/testing';

import { BfDevinceinfoService } from './bf-devinceinfo.service';

describe('BfDevinceinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfDevinceinfoService = TestBed.get(BfDevinceinfoService);
    expect(service).toBeTruthy();
  });
});
