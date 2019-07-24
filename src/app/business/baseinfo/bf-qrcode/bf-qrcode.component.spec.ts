import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfQrcodeComponent } from './bf-qrcode.component';

describe('BfQrcodeComponent', () => {
  let component: BfQrcodeComponent;
  let fixture: ComponentFixture<BfQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
