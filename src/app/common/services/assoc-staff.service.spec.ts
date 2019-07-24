import { TestBed } from '@angular/core/testing';

import { AssocStaffService } from './assoc-staff.service';

describe('AssocStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssocStaffService = TestBed.get(AssocStaffService);
    expect(service).toBeTruthy();
  });
});
