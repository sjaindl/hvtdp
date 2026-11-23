import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { MatchInfo } from '../shared/match-info';
import { News } from '../shared/news';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links the last result to its match report', () => {
    component.lastResult = { id: 71 } as MatchInfo;
    component.news = [{ newsId: 9, matchId: null } as News, { newsId: 8, matchId: 71 } as News];
    expect(component.reportNewsId).toBe(8);
    component.news = [];
    expect(component.reportNewsId).toBeNull();
  });
});
