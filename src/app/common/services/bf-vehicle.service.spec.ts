import { TestBed } from '@angular/core/testing';

import { BfVehicleService } from './bf-vehicle.service';

describe('BfVehicleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfVehicleService = TestBed.get(BfVehicleService);
    expect(service).toBeTruthy();
  });
});
