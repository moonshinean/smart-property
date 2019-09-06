import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentOwnerComponent } from './latepayment-owner.component';

describe('LatepaymentOwnerComponent', () => {
  let component: LatepaymentOwnerComponent;
  let fixture: ComponentFixture<LatepaymentOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
