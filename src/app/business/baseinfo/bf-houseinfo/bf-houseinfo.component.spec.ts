import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfHouseinfoComponent } from './bf-houseinfo.component';

describe('BfHouseinfoComponent', () => {
  let component: BfHouseinfoComponent;
  let fixture: ComponentFixture<BfHouseinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfHouseinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfHouseinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
