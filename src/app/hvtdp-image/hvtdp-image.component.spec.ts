import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvtdpImageComponent } from './hvtdp-image.component';

describe('HvtdpImageComponent', () => {
  let component: HvtdpImageComponent;
  let fixture: ComponentFixture<HvtdpImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HvtdpImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HvtdpImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
