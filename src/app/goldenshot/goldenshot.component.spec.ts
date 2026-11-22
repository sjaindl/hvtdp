import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { GoldenshotComponent } from './goldenshot.component';

describe('GoldenshotComponent', () => {
  let component: GoldenshotComponent;
  let fixture: ComponentFixture<GoldenshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldenshotComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(GoldenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
