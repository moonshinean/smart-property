import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCumulativeVacancyfeeComponent } from './charge-cumulative-vacancyfee.component';

describe('ChargeCumulativeVacancyfeeComponent', () => {
  let component: ChargeCumulativeVacancyfeeComponent;
  let fixture: ComponentFixture<ChargeCumulativeVacancyfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCumulativeVacancyfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCumulativeVacancyfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
