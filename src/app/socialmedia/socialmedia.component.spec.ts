import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { provideTestDependencies } from '../../testing/test-providers';
import { SocialmediaComponent } from './socialmedia.component';

describe('SocialmediaComponent', () => {
  let component: SocialmediaComponent;
  let fixture: ComponentFixture<SocialmediaComponent>;
  let http: HttpTestingController;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });
  const match = (id: number, season: string, overrides: object = {}) => ({
    id,
    season: { key: season },
    competition: 'Meisterschaft',
    round: 3,
    stage: null,
    title: null,
    date: '2026-09-12',
    time: null,
    venue: null,
    homeTeam: 'HV TDP Stainz',
    awayTeam: 'STT Pichler',
    homeScore: 3,
    awayScore: 1,
    additionalInfo: null,
    videos: [
      { url: `https://www.youtube.com/embed/${id}`, description: '1:0', name: null, player: null },
    ],
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialmediaComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(SocialmediaComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('derives the seasons from the videos and shows the newest one without a season in the URL', () => {
    http
      .expectOne((r) => r.url === `${environment.cmsUrl}/api/matches`)
      .flush(
        page([
          match(1, '2017-2018', { date: '2018-06-14', homeScore: null, awayScore: null }),
          match(2, '2026-2027'),
          match(3, '2021-2022', {
            competition: 'Event',
            title: '1. Entenrennen Stainz',
            round: null,
            homeTeam: null,
            awayTeam: null,
          }),
        ])
      );
    expect(component.seasons).toEqual(['2026-2027', '2021-2022', '2017-2018']);
    expect(component.season).toBe('2026-2027');
    const [item] = component.items;
    expect(component.title(item.match)).toBe('HV TDP Stainz – STT Pichler');
    expect(component.meta(item.match)).toBe('3. Runde · Sa, 12.09.2026');
    expect(component.scoreLabel(item.match)).toBe('3:1');
  });

  it('filters by player across all seasons and lists the scorers by last name', () => {
    const goal = (
      url: string,
      player: { firstName: string; lastName: string } | null,
      name: string | null = null
    ) => ({
      url,
      description: '1:0',
      name,
      player,
    });
    const fabian = { firstName: 'Daniel', lastName: 'Fabian' };
    const jaindl = { firstName: 'Stefan', lastName: 'Jaindl' };
    http
      .expectOne((r) => r.url === `${environment.cmsUrl}/api/matches`)
      .flush(
        page([
          match(1, '2017-2018', {
            date: '2018-06-14',
            videos: [goal('a', fabian), goal('b', null, 'Eigentor')],
          }),
          match(2, '2026-2027', { videos: [goal('c', jaindl), goal('d', fabian)] }),
          match(3, '2026-2027', { date: '2026-09-04', videos: [goal('e', jaindl)] }),
        ])
      );
    expect(component.players).toEqual([
      { name: 'Daniel Fabian', count: 2 },
      { name: 'Stefan Jaindl', count: 2 },
    ]);

    TestBed.inject(Router).navigate([], { queryParams: { spieler: 'Daniel Fabian' } });
    return fixture.whenStable().then(() => {
      expect(component.player).toBe('Daniel Fabian');
      expect(
        component.items.map((item) => [item.match.id, item.videos.map((video) => video.url)])
      ).toEqual([
        [2, ['d']],
        [1, ['a']],
      ]);
    });
  });
});
