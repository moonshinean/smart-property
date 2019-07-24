import { TestBed } from '@angular/core/testing';

import { SetCarkindService } from './set-carkind.service';

describe('SetCarkindService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetCarkindService = TestBed.get(SetCarkindService);
    expect(service).toBeTruthy();
  });
});
