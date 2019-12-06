import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfVacantRoomComponent } from './bf-vacant-room.component';

describe('BfVacantRoomComponent', () => {
  let component: BfVacantRoomComponent;
  let fixture: ComponentFixture<BfVacantRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfVacantRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfVacantRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
