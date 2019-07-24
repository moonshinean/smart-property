import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorComplaintComponent } from './monitor-complaint.component';

describe('MonitorComplaintComponent', () => {
  let component: MonitorComplaintComponent;
  let fixture: ComponentFixture<MonitorComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
