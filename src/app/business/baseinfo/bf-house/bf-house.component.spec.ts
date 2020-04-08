import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfHouseComponent } from './bf-house.component';

describe('BfHouseComponent', () => {
  let component: BfHouseComponent;
  let fixture: ComponentFixture<BfHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
