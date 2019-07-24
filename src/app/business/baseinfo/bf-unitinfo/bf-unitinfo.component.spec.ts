import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfUnitinfoComponent } from './bf-unitinfo.component';

describe('BfUnitinfoComponent', () => {
  let component: BfUnitinfoComponent;
  let fixture: ComponentFixture<BfUnitinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfUnitinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfUnitinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
