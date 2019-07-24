import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfWorkgroupComponent } from './bf-workgroup.component';

describe('BfWorkgroupComponent', () => {
  let component: BfWorkgroupComponent;
  let fixture: ComponentFixture<BfWorkgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfWorkgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfWorkgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
