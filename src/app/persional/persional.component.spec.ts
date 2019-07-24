import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersionalComponent } from './persional.component';

describe('PersionalComponent', () => {
  let component: PersionalComponent;
  let fixture: ComponentFixture<PersionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
