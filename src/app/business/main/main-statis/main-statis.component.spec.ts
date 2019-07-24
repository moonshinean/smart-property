import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStatisComponent } from './main-statis.component';

describe('MainStatisComponent', () => {
  let component: MainStatisComponent;
  let fixture: ComponentFixture<MainStatisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainStatisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
