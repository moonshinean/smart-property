import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfParcelinfoComponent } from './bf-parcelinfo.component';

describe('BfParcelinfoComponent', () => {
  let component: BfParcelinfoComponent;
  let fixture: ComponentFixture<BfParcelinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfParcelinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfParcelinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
