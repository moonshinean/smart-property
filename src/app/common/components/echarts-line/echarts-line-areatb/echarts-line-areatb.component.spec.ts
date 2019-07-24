import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsLineAreatbComponent } from './echarts-line-areatb.component';

describe('EchartsLineAreatbComponent', () => {
  let component: EchartsLineAreatbComponent;
  let fixture: ComponentFixture<EchartsLineAreatbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsLineAreatbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsLineAreatbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
