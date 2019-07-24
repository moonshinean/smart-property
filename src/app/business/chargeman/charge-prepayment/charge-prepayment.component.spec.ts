import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePrepaymentComponent } from './charge-prepayment.component';

describe('ChargePrepaymentComponent', () => {
  let component: ChargePrepaymentComponent;
  let fixture: ComponentFixture<ChargePrepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargePrepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePrepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
