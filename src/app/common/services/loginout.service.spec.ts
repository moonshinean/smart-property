import { TestBed } from '@angular/core/testing';

import { LoginoutService } from './loginout.service';

describe('LoginoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginoutService = TestBed.get(LoginoutService);
    expect(service).toBeTruthy();
  });
});
