import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfVehicleComponent } from './bf-vehicle.component';

describe('BfVehicleComponent', () => {
  let component: BfVehicleComponent;
  let fixture: ComponentFixture<BfVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
