import { TestBed } from '@angular/core/testing';

import { SetNationService } from './set-nation.service';

describe('SetNationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetNationService = TestBed.get(SetNationService);
    expect(service).toBeTruthy();
  });
});
