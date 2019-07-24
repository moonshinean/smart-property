import { TestBed } from '@angular/core/testing';

import { SetConfigService } from './set-config.service';

describe('SetConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetConfigService = TestBed.get(SetConfigService);
    expect(service).toBeTruthy();
  });
});
