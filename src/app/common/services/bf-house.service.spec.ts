import { TestBed } from '@angular/core/testing';

import { BfHouseService } from './bf-house.service';

describe('BfHouseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfHouseService = TestBed.get(BfHouseService);
    expect(service).toBeTruthy();
  });
});
