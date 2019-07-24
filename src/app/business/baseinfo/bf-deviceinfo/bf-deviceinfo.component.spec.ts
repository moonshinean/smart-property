import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfDeviceinfoComponent } from './bf-deviceinfo.component';

describe('BfDeviceinfoComponent', () => {
  let component: BfDeviceinfoComponent;
  let fixture: ComponentFixture<BfDeviceinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfDeviceinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfDeviceinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
