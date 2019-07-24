import { TestBed } from '@angular/core/testing';

import { SetPermissionService } from './set-permission.service';

describe('SetPermissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetPermissionService = TestBed.get(SetPermissionService);
    expect(service).toBeTruthy();
  });
});
