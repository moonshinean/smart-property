import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCarkindComponent } from './set-carkind.component';

describe('SetCarkindComponent', () => {
  let component: SetCarkindComponent;
  let fixture: ComponentFixture<SetCarkindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCarkindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCarkindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
