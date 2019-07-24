import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsBarPortComponent } from './echarts-bar-port.component';

describe('EchartsBarPortComponent', () => {
  let component: EchartsBarPortComponent;
  let fixture: ComponentFixture<EchartsBarPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsBarPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsBarPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
