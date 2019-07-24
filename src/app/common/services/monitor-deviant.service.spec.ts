import { TestBed } from '@angular/core/testing';

import { MonitorDeviantService } from './monitor-deviant.service';

describe('MonitorDeviantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorDeviantService = TestBed.get(MonitorDeviantService);
    expect(service).toBeTruthy();
  });
});
