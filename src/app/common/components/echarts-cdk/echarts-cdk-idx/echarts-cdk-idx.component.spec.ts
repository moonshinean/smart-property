import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsCdkIdxComponent } from './echarts-cdk-idx.component';

describe('EchartsCdkIdxComponent', () => {
  let component: EchartsCdkIdxComponent;
  let fixture: ComponentFixture<EchartsCdkIdxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsCdkIdxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsCdkIdxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
