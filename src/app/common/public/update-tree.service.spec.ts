import { TestBed } from '@angular/core/testing';

import { UpdateTreeService } from './update-tree.service';

describe('UpdateTreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateTreeService = TestBed.get(UpdateTreeService);
    expect(service).toBeTruthy();
  });
});
