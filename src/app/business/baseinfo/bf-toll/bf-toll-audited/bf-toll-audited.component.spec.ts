import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfTollAuditedComponent } from './bf-toll-audited.component';

describe('BfTollAuditedComponent', () => {
  let component: BfTollAuditedComponent;
  let fixture: ComponentFixture<BfTollAuditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfTollAuditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfTollAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
