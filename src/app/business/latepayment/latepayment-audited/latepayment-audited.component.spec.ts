import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentAuditedComponent } from './latepayment-audited.component';

describe('LatepaymentAuditedComponent', () => {
  let component: LatepaymentAuditedComponent;
  let fixture: ComponentFixture<LatepaymentAuditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentAuditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
