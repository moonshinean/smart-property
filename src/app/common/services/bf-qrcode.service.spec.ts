import { TestBed } from '@angular/core/testing';

import { BfQrcodeService } from './bf-qrcode.service';

describe('BfQrcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfQrcodeService = TestBed.get(BfQrcodeService);
    expect(service).toBeTruthy();
  });
});
