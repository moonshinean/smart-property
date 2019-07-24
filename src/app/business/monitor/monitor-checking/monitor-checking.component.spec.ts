import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorCheckingComponent } from './monitor-checking.component';

describe('MonitorCheckingComponent', () => {
  let component: MonitorCheckingComponent;
  let fixture: ComponentFixture<MonitorCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
