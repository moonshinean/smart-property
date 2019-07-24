import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsetComponent } from './systemset.component';

describe('SystemsetComponent', () => {
  let component: SystemsetComponent;
  let fixture: ComponentFixture<SystemsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
