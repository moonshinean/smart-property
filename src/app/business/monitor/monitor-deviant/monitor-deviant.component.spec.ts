import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorDeviantComponent } from './monitor-deviant.component';

describe('MonitorDeviantComponent', () => {
  let component: MonitorDeviantComponent;
  let fixture: ComponentFixture<MonitorDeviantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorDeviantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorDeviantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
