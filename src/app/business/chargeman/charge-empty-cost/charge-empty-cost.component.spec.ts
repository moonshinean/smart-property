import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeEmptyCostComponent } from './charge-empty-cost.component';

describe('ChargeEmptyCostComponent', () => {
  let component: ChargeEmptyCostComponent;
  let fixture: ComponentFixture<ChargeEmptyCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeEmptyCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeEmptyCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
