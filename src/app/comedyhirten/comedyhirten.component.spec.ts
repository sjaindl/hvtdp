import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComedyhirtenComponent } from './comedyhirten.component';

describe('ComedyhirtenComponent', () => {
  let component: ComedyhirtenComponent;
  let fixture: ComponentFixture<ComedyhirtenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComedyhirtenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComedyhirtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
