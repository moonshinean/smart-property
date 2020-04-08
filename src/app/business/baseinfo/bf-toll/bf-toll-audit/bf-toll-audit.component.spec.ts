import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfTollAuditComponent } from './bf-toll-audit.component';

describe('BfTollAuditComponent', () => {
  let component: BfTollAuditComponent;
  let fixture: ComponentFixture<BfTollAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfTollAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfTollAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
