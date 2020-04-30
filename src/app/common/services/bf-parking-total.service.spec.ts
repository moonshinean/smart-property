import { TestBed } from '@angular/core/testing';

import { BfParkingTotalService } from './bf-parking-total.service';

describe('BfParkingTotalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfParkingTotalService = TestBed.get(BfParkingTotalService);
    expect(service).toBeTruthy();
  });
});
