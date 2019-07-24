import { TestBed } from '@angular/core/testing';

import { MonitorLogService } from './monitor-log.service';

describe('MonitorLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorLogService = TestBed.get(MonitorLogService);
    expect(service).toBeTruthy();
  });
});
