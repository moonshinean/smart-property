import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargemanComponent } from './chargeman.component';

describe('ChargemanComponent', () => {
  let component: ChargemanComponent;
  let fixture: ComponentFixture<ChargemanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargemanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
