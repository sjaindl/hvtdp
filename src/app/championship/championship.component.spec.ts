import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { ChampionshipComponent } from './championship.component';

describe('ChampionshipComponent', () => {
  let component: ChampionshipComponent;
  let fixture: ComponentFixture<ChampionshipComponent>;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionshipComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(ChampionshipComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the newest season with its league and notes when the URL has no season', () => {
    http
      .expectOne((r) => r.url === `${api}/seasons`)
      .flush(
        page([
          {
            key: '2026-2027',
            league: 'Liga B',
            preface: 'Play-off am Saisonende.\n\nZweiter Absatz.',
            postResults: null,
          },
          { key: '2025-2026', league: 'Liga B', preface: null, postResults: null },
        ])
      );
    expect(component.season).toBe('2026-2027');
    expect(component.seasonInfo?.league).toBe('Liga B');
    expect(component.paragraphs(component.seasonInfo?.preface)).toEqual([
      'Play-off am Saisonende.',
      'Zweiter Absatz.',
    ]);

    for (const type of ['standings', 'scorers', 'matches']) {
      const request = http.expectOne((r) => r.url === `${api}/${type}`);
      expect(request.request.params.get('filters[season][key][$eq]')).toBe('2026-2027');
      request.flush(page([]));
    }
    expect(component.loaded).toBeTrue();
  });
});
