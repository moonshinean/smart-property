import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeExportComponent } from './charge-export.component';

describe('ChargeExportComponent', () => {
  let component: ChargeExportComponent;
  let fixture: ComponentFixture<ChargeExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
