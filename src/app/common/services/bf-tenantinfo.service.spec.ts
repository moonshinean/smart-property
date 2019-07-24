import { TestBed } from '@angular/core/testing';

import { BfTenantinfoService } from './bf-tenantinfo.service';

describe('BfTenantinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfTenantinfoService = TestBed.get(BfTenantinfoService);
    expect(service).toBeTruthy();
  });
});
