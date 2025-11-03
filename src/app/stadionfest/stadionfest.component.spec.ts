import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadionFestComponent } from './stadionfest.component';

describe('StadionfestComponent', () => {
  let component: StadionFestComponent;
  let fixture: ComponentFixture<StadionFestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StadionFestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadionFestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
