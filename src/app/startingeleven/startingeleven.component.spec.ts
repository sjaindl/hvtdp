import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingelevenComponent } from './startingeleven.component';

describe('StartingelevenComponent', () => {
  let component: StartingelevenComponent;
  let fixture: ComponentFixture<StartingelevenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StartingelevenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingelevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
