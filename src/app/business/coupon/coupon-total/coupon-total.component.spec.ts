import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponTotalComponent } from './coupon-total.component';

describe('CouponTotalComponent', () => {
  let component: CouponTotalComponent;
  let fixture: ComponentFixture<CouponTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
