import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeRecordComponent } from './charge-record.component';

describe('ChargeRecordComponent', () => {
  let component: ChargeRecordComponent;
  let fixture: ComponentFixture<ChargeRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
