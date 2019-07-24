import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfOwnerComponent } from './bf-owner.component';

describe('BfOwnerComponent', () => {
  let component: BfOwnerComponent;
  let fixture: ComponentFixture<BfOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
