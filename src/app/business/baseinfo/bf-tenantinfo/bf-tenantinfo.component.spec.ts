import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfTenantinfoComponent } from './bf-tenantinfo.component';

describe('BfTenantinfoComponent', () => {
  let component: BfTenantinfoComponent;
  let fixture: ComponentFixture<BfTenantinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfTenantinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfTenantinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
