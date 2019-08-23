import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentComponent } from './latepayment.component';

describe('LatepaymentComponent', () => {
  let component: LatepaymentComponent;
  let fixture: ComponentFixture<LatepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
