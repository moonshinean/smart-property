import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsBarLargeComponent } from './echarts-bar-large.component';

describe('EchartsBarLargeComponent', () => {
  let component: EchartsBarLargeComponent;
  let fixture: ComponentFixture<EchartsBarLargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsBarLargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsBarLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
