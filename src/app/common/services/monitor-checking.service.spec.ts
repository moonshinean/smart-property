import { TestBed } from '@angular/core/testing';

import { MonitorCheckingService } from './monitor-checking.service';

describe('MonitorCheckingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorCheckingService = TestBed.get(MonitorCheckingService);
    expect(service).toBeTruthy();
  });
});
