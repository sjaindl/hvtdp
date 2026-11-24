import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { News, NewsCategory } from '../shared/news';
import { NewsComponent } from './news.component';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  const news = (newsId: number, date: string, category: NewsCategory | null): News => ({
    newsId,
    newsDate: new Date(date),
    title: `News ${newsId}`,
    content: '',
    imageUrl: null,
    homeImageUrl: null,
    category,
    matchId: null,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters by category and year together, and resets both', () => {
    component.news = [
      news(4, '2026-10-24', 'Spielbericht'),
      news(3, '2026-08-22', 'Turnier'),
      news(2, '2025-10-11', 'Spielbericht'),
      news(1, '2025-09-20', 'Veranstaltung'),
    ];
    component.selectCategory('Spielbericht');
    expect(component.filteredNews.map((item) => item.newsId)).toEqual([4, 2]);
    component.selectYear('2025');
    expect(component.filteredNews.map((item) => item.newsId)).toEqual([2]);
    expect(component.filterKey).toBe('Spielbericht|2025');
    component.resetFilters();
    expect(component.filteredNews.length).toBe(4);
  });
});
