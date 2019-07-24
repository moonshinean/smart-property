import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfParkingspaceComponent } from './bf-parkingspace.component';

describe('BfParkingspaceComponent', () => {
  let component: BfParkingspaceComponent;
  let fixture: ComponentFixture<BfParkingspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfParkingspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfParkingspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
