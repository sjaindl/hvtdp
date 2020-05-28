import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HallofpappComponent } from './hallofpapp.component';

describe('HallofpappComponent', () => {
  let component: HallofpappComponent;
  let fixture: ComponentFixture<HallofpappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallofpappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallofpappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
