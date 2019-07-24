import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundPendReviewComponent } from './refund-pend-review.component';

describe('RefundPendReviewComponent', () => {
  let component: RefundPendReviewComponent;
  let fixture: ComponentFixture<RefundPendReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundPendReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundPendReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
