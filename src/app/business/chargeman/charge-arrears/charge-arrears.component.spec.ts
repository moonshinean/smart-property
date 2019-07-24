import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeArrearsComponent } from './charge-arrears.component';

describe('ChargeArrearsComponent', () => {
  let component: ChargeArrearsComponent;
  let fixture: ComponentFixture<ChargeArrearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeArrearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeArrearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
