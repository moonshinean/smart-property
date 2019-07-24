import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEventComponent } from './main-event.component';

describe('MainEventComponent', () => {
  let component: MainEventComponent;
  let fixture: ComponentFixture<MainEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
