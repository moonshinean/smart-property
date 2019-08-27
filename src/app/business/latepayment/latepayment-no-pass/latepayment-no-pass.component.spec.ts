import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatepaymentNoPassComponent } from './latepayment-no-pass.component';

describe('LatepaymentNoPassComponent', () => {
  let component: LatepaymentNoPassComponent;
  let fixture: ComponentFixture<LatepaymentNoPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatepaymentNoPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatepaymentNoPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
