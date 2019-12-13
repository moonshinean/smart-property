import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsPaymentPieComponent } from './echarts-payment-pie.component';

describe('EchartsPaymentPieComponent', () => {
  let component: EchartsPaymentPieComponent;
  let fixture: ComponentFixture<EchartsPaymentPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsPaymentPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsPaymentPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
