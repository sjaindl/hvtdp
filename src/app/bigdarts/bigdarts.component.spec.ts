import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigdartsComponent } from './bigdarts.component';

describe('BigdartsComponent', () => {
  let component: BigdartsComponent;
  let fixture: ComponentFixture<BigdartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigdartsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BigdartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
