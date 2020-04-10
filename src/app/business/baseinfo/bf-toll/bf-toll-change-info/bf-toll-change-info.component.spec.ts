import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfTollChangeInfoComponent } from './bf-toll-change-info.component';

describe('BfTollChangeInfoComponent', () => {
  let component: BfTollChangeInfoComponent;
  let fixture: ComponentFixture<BfTollChangeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfTollChangeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfTollChangeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
