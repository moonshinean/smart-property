import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCarbrandComponent } from './set-carbrand.component';

describe('SetCarbrandComponent', () => {
  let component: SetCarbrandComponent;
  let fixture: ComponentFixture<SetCarbrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCarbrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCarbrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
