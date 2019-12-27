import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePayParkspaceComponent } from './charge-pay-parkspace.component';

describe('ChargePayParkspaceComponent', () => {
  let component: ChargePayParkspaceComponent;
  let fixture: ComponentFixture<ChargePayParkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargePayParkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePayParkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
