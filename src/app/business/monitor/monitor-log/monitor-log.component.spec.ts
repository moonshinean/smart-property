import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorLogComponent } from './monitor-log.component';

describe('MonitorLogComponent', () => {
  let component: MonitorLogComponent;
  let fixture: ComponentFixture<MonitorLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
