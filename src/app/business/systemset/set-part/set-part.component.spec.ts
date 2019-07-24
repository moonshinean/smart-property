import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPartComponent } from './set-part.component';

describe('SetPartComponent', () => {
  let component: SetPartComponent;
  let fixture: ComponentFixture<SetPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
