import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { HvtdpImageComponent } from './hvtdp-image.component';

describe('HvtdpImageComponent', () => {
  let component: HvtdpImageComponent;
  let fixture: ComponentFixture<HvtdpImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HvtdpImageComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(HvtdpImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imagePath', 'assets/images/hvtdp.png');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
