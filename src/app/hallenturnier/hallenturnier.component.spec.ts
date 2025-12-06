import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallenturnierComponent } from './hallenturnier.component';

describe('HallenturnierComponent', () => {
  let component: HallenturnierComponent;
  let fixture: ComponentFixture<HallenturnierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HallenturnierComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HallenturnierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
