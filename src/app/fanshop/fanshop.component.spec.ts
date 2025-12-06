import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanshopComponent } from './fanshop.component';

describe('FanshopComponent', () => {
  let component: FanshopComponent;
  let fixture: ComponentFixture<FanshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FanshopComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
