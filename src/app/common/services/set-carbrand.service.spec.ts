import { TestBed } from '@angular/core/testing';

import { SetCarbrandService } from './set-carbrand.service';

describe('SetCarbrandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetCarbrandService = TestBed.get(SetCarbrandService);
    expect(service).toBeTruthy();
  });
});
