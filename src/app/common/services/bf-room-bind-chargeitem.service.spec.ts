import { TestBed } from '@angular/core/testing';

import { BfRoomBindChargeitemService } from './bf-room-bind-chargeitem.service';

describe('BfRoomBindChargeitemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfRoomBindChargeitemService = TestBed.get(BfRoomBindChargeitemService);
    expect(service).toBeTruthy();
  });
});
