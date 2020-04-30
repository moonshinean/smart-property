import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfParkingTotalComponent } from './bf-parking-total.component';

describe('BfParkingTotalComponent', () => {
  let component: BfParkingTotalComponent;
  let fixture: ComponentFixture<BfParkingTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfParkingTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfParkingTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
