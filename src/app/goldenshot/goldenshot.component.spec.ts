import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenshotComponent } from './goldenshot.component';

describe('GoldenshotComponent', () => {
  let component: GoldenshotComponent;
  let fixture: ComponentFixture<GoldenshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldenshotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
