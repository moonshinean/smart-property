import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponAuditedComponent } from './coupon-audited.component';

describe('CouponAuditedComponent', () => {
  let component: CouponAuditedComponent;
  let fixture: ComponentFixture<CouponAuditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponAuditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
