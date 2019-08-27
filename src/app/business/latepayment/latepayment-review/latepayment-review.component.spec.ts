import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentReviewComponent } from './latepayment-review.component';

describe('LatepaymentReviewComponent', () => {
  let component: LatepaymentReviewComponent;
  let fixture: ComponentFixture<LatepaymentReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
