import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { SurveysComponent } from './surveys.component';

describe('SurveysComponent', () => {
  let component: SurveysComponent;
  let fixture: ComponentFixture<SurveysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveysComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(SurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
