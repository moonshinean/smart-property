import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsMapComponent } from './echarts-map.component';

describe('EchartsMapComponent', () => {
  let component: EchartsMapComponent;
  let fixture: ComponentFixture<EchartsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
