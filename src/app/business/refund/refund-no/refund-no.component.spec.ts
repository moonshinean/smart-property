import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundNoComponent } from './refund-no.component';

describe('RefundNoComponent', () => {
  let component: RefundNoComponent;
  let fixture: ComponentFixture<RefundNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
