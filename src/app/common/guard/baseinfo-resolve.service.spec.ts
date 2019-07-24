import { TestBed } from '@angular/core/testing';

import { BaseinfoResolveService } from './baseinfo-resolve.service';

describe('BaseinfoResolveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseinfoResolveService = TestBed.get(BaseinfoResolveService);
    expect(service).toBeTruthy();
  });
});
