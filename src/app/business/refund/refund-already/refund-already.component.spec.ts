import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundAlreadyComponent } from './refund-already.component';

describe('RefundAlreadyComponent', () => {
  let component: RefundAlreadyComponent;
  let fixture: ComponentFixture<RefundAlreadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundAlreadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundAlreadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
