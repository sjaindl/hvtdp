import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { GoalOfTheSeasonComponent } from './goaloftheseason.component';

describe('GoalOfTheSeasonComponent', () => {
  let component: GoalOfTheSeasonComponent;
  let fixture: ComponentFixture<GoalOfTheSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalOfTheSeasonComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(GoalOfTheSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
