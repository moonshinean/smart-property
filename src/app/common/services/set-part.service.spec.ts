import { TestBed } from '@angular/core/testing';

import { SetPartService } from './set-part.service';

describe('SetPartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetPartService = TestBed.get(SetPartService);
    expect(service).toBeTruthy();
  });
});
