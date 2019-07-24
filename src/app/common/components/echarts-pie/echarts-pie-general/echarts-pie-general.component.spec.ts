import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsPieGeneralComponent } from './echarts-pie-general.component';

describe('EchartsPieGeneralComponent', () => {
  let component: EchartsPieGeneralComponent;
  let fixture: ComponentFixture<EchartsPieGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsPieGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsPieGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
