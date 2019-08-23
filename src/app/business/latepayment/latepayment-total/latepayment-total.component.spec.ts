import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentTotalComponent } from './latepayment-total.component';

describe('LatepaymentTotalComponent', () => {
  let component: LatepaymentTotalComponent;
  let fixture: ComponentFixture<LatepaymentTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
