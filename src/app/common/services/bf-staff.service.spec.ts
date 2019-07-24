import { TestBed } from '@angular/core/testing';

import { BfStaffService } from './bf-staff.service';

describe('BfStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfStaffService = TestBed.get(BfStaffService);
    expect(service).toBeTruthy();
  });
});
