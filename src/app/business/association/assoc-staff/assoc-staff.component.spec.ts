import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssocStaffComponent } from './assoc-staff.component';

describe('AssocStaffComponent', () => {
  let component: AssocStaffComponent;
  let fixture: ComponentFixture<AssocStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssocStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssocStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
