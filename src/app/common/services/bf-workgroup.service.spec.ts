import { TestBed } from '@angular/core/testing';

import { BfWorkgroupService } from './bf-workgroup.service';

describe('BfWorkgroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfWorkgroupService = TestBed.get(BfWorkgroupService);
    expect(service).toBeTruthy();
  });
});
