import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { FanshopComponent } from './fanshop.component';

describe('FanshopComponent', () => {
  let component: FanshopComponent;
  let fixture: ComponentFixture<FanshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FanshopComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(FanshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
