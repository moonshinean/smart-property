import { TestBed } from '@angular/core/testing';

import { PersionalService } from './persional.service';

describe('PersionalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersionalService = TestBed.get(PersionalService);
    expect(service).toBeTruthy();
  });
});
