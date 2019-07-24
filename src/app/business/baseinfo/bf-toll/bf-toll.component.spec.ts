import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfTollComponent } from './bf-toll.component';

describe('BfTollComponent', () => {
  let component: BfTollComponent;
  let fixture: ComponentFixture<BfTollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfTollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfTollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
