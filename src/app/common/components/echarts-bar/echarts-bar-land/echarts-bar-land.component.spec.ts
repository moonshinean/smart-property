import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsBarLandComponent } from './echarts-bar-land.component';

describe('EchartsBarLandComponent', () => {
  let component: EchartsBarLandComponent;
  let fixture: ComponentFixture<EchartsBarLandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsBarLandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsBarLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
