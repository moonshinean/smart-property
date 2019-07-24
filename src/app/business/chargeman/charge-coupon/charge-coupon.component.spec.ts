import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCouponComponent } from './charge-coupon.component';

describe('ChargeCouponComponent', () => {
  let component: ChargeCouponComponent;
  let fixture: ComponentFixture<ChargeCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
