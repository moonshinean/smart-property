import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsBarPortlineComponent } from './echarts-bar-portline.component';

describe('EchartsBarPortlineComponent', () => {
  let component: EchartsBarPortlineComponent;
  let fixture: ComponentFixture<EchartsBarPortlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsBarPortlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsBarPortlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
