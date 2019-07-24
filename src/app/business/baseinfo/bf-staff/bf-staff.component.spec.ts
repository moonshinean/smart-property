import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfStaffComponent } from './bf-staff.component';

describe('BfStaffComponent', () => {
  let component: BfStaffComponent;
  let fixture: ComponentFixture<BfStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
