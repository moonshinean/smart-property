import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfCouponComponent } from './bf-coupon.component';

describe('BfCouponComponent', () => {
  let component: BfCouponComponent;
  let fixture: ComponentFixture<BfCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
