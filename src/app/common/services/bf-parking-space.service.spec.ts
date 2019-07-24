import { TestBed } from '@angular/core/testing';

import { BfParkingSpaceService } from './bf-parking-space.service';

describe('BfParkingSpaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfParkingSpaceService = TestBed.get(BfParkingSpaceService);
    expect(service).toBeTruthy();
  });
});
