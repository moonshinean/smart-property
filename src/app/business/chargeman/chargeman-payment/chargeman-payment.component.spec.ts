import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargemanPaymentComponent } from './chargeman-payment.component';

describe('ChargemanPaymentComponent', () => {
  let component: ChargemanPaymentComponent;
  let fixture: ComponentFixture<ChargemanPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargemanPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargemanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
