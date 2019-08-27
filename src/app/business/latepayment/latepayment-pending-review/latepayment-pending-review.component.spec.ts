import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentPendingReviewComponent } from './latepayment-pending-review.component';

describe('LatepaymentPendingReviewComponent', () => {
  let component: LatepaymentPendingReviewComponent;
  let fixture: ComponentFixture<LatepaymentPendingReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentPendingReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentPendingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
