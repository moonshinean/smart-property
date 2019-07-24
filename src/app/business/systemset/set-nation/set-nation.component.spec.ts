import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNationComponent } from './set-nation.component';

describe('SetNationComponent', () => {
  let component: SetNationComponent;
  let fixture: ComponentFixture<SetNationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetNationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetNationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
