import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfProjectinfoComponent } from './bf-projectinfo.component';

describe('BfProjectinfoComponent', () => {
  let component: BfProjectinfoComponent;
  let fixture: ComponentFixture<BfProjectinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfProjectinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfProjectinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
