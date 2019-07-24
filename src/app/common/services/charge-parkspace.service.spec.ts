import { TestBed } from '@angular/core/testing';

import { ChargeParkspaceService } from './charge-parkspace.service';

describe('ChargeParkspaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeParkspaceService = TestBed.get(ChargeParkspaceService);
    expect(service).toBeTruthy();
  });
});
