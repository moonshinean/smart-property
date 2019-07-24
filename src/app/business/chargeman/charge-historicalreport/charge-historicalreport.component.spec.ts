import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeHistoricalreportComponent } from './charge-historicalreport.component';

describe('ChargeHistoricalreportComponent', () => {
  let component: ChargeHistoricalreportComponent;
  let fixture: ComponentFixture<ChargeHistoricalreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeHistoricalreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeHistoricalreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
