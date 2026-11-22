import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { PlayerOfTheSeasonComponent } from './playeroftheseason.component';

describe('PlayerOfTheSeasonComponent', () => {
  let component: PlayerOfTheSeasonComponent;
  let fixture: ComponentFixture<PlayerOfTheSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerOfTheSeasonComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerOfTheSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
