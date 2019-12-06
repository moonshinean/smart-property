import { TestBed } from '@angular/core/testing';

import { BfVacantRoomService } from './bf-vacant-room.service';

describe('BfVacantRoomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BfVacantRoomService = TestBed.get(BfVacantRoomService);
    expect(service).toBeTruthy();
  });
});
