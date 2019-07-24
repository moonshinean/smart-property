import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfBuildinginfoComponent } from './bf-buildinginfo.component';

describe('BfBuildinginfoComponent', () => {
  let component: BfBuildinginfoComponent;
  let fixture: ComponentFixture<BfBuildinginfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfBuildinginfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfBuildinginfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
