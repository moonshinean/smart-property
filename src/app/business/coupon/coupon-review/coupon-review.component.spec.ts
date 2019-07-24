import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponReviewComponent } from './coupon-review.component';

describe('CouponReviewComponent', () => {
  let component: CouponReviewComponent;
  let fixture: ComponentFixture<CouponReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
