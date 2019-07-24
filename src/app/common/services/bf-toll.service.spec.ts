import { TestBed } from '@angular/core/testing';

import { BfTollService } from './bf-toll.service';

describe('BfTollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfTollService = TestBed.get(BfTollService);
    expect(service).toBeTruthy();
  });
});
