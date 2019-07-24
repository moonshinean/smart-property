import { TestBed } from '@angular/core/testing';

import { MonitorComplaintService } from './monitor-complaint.service';

describe('MonitorComplaintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorComplaintService = TestBed.get(MonitorComplaintService);
    expect(service).toBeTruthy();
  });
});
