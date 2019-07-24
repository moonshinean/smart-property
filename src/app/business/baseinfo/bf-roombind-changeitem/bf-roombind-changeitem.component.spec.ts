import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfRoombindChangeitemComponent } from './bf-roombind-changeitem.component';

describe('BfRoombindChangeitemComponent', () => {
  let component: BfRoombindChangeitemComponent;
  let fixture: ComponentFixture<BfRoombindChangeitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfRoombindChangeitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfRoombindChangeitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
