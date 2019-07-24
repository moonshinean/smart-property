import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundApplicationInfoComponent } from './refund-application-info.component';

describe('RefundApplicationInfoComponent', () => {
  let component: RefundApplicationInfoComponent;
  let fixture: ComponentFixture<RefundApplicationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundApplicationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundApplicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
