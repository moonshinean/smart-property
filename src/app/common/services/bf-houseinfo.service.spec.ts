import { TestBed } from '@angular/core/testing';

import { BfHouseinfoService } from './bf-houseinfo.service';

describe('BfHouseinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfHouseinfoService = TestBed.get(BfHouseinfoService);
    expect(service).toBeTruthy();
  });
});
