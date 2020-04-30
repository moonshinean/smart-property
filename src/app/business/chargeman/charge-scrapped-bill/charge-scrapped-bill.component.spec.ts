import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeScrappedBillComponent } from './charge-scrapped-bill.component';

describe('ChargeScrappedBillComponent', () => {
  let component: ChargeScrappedBillComponent;
  let fixture: ComponentFixture<ChargeScrappedBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeScrappedBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeScrappedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
