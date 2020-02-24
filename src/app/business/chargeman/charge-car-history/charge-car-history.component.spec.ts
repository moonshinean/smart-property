import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCarHistoryComponent } from './charge-car-history.component';

describe('ChargeCarHistoryComponent', () => {
  let component: ChargeCarHistoryComponent;
  let fixture: ComponentFixture<ChargeCarHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCarHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCarHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
