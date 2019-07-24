import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeParkspaceComponent } from './charge-parkspace.component';

describe('ChargeParkspaceComponent', () => {
  let component: ChargeParkspaceComponent;
  let fixture: ComponentFixture<ChargeParkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeParkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeParkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
