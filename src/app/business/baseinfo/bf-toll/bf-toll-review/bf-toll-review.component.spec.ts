import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfTollReviewComponent } from './bf-toll-review.component';

describe('BfTollReviewComponent', () => {
  let component: BfTollReviewComponent;
  let fixture: ComponentFixture<BfTollReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfTollReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfTollReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
