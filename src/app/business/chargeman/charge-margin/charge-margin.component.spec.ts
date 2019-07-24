import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeMarginComponent } from './charge-margin.component';

describe('ChargeMarginComponent', () => {
  let component: ChargeMarginComponent;
  let fixture: ComponentFixture<ChargeMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeMarginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
