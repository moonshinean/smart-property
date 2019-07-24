import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponPendingReviewComponent } from './coupon-pending-review.component';

describe('CouponPendingReviewComponent', () => {
  let component: CouponPendingReviewComponent;
  let fixture: ComponentFixture<CouponPendingReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponPendingReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponPendingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
