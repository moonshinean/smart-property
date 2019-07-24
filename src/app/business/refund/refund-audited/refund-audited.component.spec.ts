import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundAuditedComponent } from './refund-audited.component';

describe('RefundAuditedComponent', () => {
  let component: RefundAuditedComponent;
  let fixture: ComponentFixture<RefundAuditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundAuditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
