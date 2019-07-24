import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReviewComponent } from './refund-review.component';

describe('RefundReviewComponent', () => {
  let component: RefundReviewComponent;
  let fixture: ComponentFixture<RefundReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
