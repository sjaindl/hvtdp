import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { MatchInfo } from '../shared/match-info';
import { Scorer } from '../shared/scorer';
import { Season } from '../shared/season';
import { ChampionshipService } from './championship.service';

describe('ChampionshipService', () => {
  let service: ChampionshipService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(ChampionshipService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads seasons newest first', () => {
    let seasons: Season[] = [];
    service.getSeasons().subscribe((result) => (seasons = result));
    const request = http.expectOne((r) => r.url === `${api}/seasons`);
    expect(request.request.params.get('sort[0]')).toBe('key:desc');
    request.flush(
      page([{ key: '2026-2027', league: 'Liga B', preface: null, postResults: '* Hinweis' }])
    );
    expect(seasons).toEqual([
      { key: '2026-2027', league: 'Liga B', preface: '', postResults: '* Hinweis' },
    ]);
  });

  it('maps matches with local kickoff, label and scorers', () => {
    let matches: MatchInfo[] = [];
    service.getMatches('2026-2027').subscribe((result) => (matches = result));
    const request = http.expectOne((r) => r.url === `${api}/matches`);
    expect(request.request.params.get('filters[season][key][$eq]')).toBe('2026-2027');
    request.flush(
      page([
        {
          id: 92,
          season: { key: '2026-2027' },
          competition: 'Testspiel',
          round: null,
          stage: null,
          date: '2026-08-30',
          time: '15:00:00.000',
          venue: 'Stadion Stainz',
          homeTeam: 'HV TDP Stainz',
          awayTeam: 'HFC Graz',
          homeScore: 4,
          awayScore: 7,
          additionalInfo: null,
          goals: [
            { name: 'Paschek', count: 2, player: { firstName: 'Paul', lastName: 'Paschek' } },
            { name: 'Eigentor', count: 1, player: null },
          ],
        },
        {
          id: 50,
          season: { key: '2026-2027' },
          competition: 'Cup',
          round: null,
          stage: 'Achtelfinale',
          date: '2026-10-17',
          time: null,
          venue: null,
          homeTeam: 'SV Gegner',
          awayTeam: 'HV TDP Stainz',
          homeScore: null,
          awayScore: null,
          additionalInfo: null,
          goals: null,
        },
      ])
    );

    const [test, cup] = matches;
    expect(test.kickoff).toEqual(new Date(2026, 7, 30, 15, 0));
    expect(test.hasTime).toBeTrue();
    expect(test.label).toBe('Testspiel');
    expect(test.goals).toEqual([
      { name: 'Paschek', count: 2 },
      { name: 'Eigentor', count: 1 },
    ]);
    expect(cup.kickoff).toEqual(new Date(2026, 9, 17));
    expect(cup.hasTime).toBeFalse();
    expect(cup.label).toBe('Cup Achtelfinale');
    expect(cup.goals).toEqual([]);
  });

  it('requests only the upcoming matches for the next match', () => {
    const strapiMatch = (id: number, date: string, time: string | null) => ({
      id,
      season: { key: '2026-2027' },
      competition: 'Meisterschaft',
      round: 1,
      stage: null,
      date,
      time,
      venue: null,
      homeTeam: 'HV TDP Stainz',
      awayTeam: 'SV Gast',
      homeScore: null,
      awayScore: null,
      additionalInfo: null,
      goals: [],
    });
    let next: MatchInfo | null = null;
    service.getNextMatch(new Date(2026, 8, 19, 18)).subscribe((match) => (next = match));
    const request = http.expectOne((r) => r.url === `${api}/matches`);
    expect(request.request.params.get('filters[date][$gte]')).toBe('2026-09-19');
    expect(request.request.params.get('pagination[pageSize]')).toBe('10');
    // Today 15:00 has started, today without time and next week have not.
    request.flush(
      page([
        strapiMatch(1, '2026-09-19', '15:00:00.000'),
        strapiMatch(2, '2026-09-19', null),
        strapiMatch(3, '2026-09-26', '15:00:00.000'),
      ])
    );
    expect(next!.id).toBe(2);
  });

  it('maps season scorers with portrait, most goals first', () => {
    let scorers: Scorer[] = [];
    service.getScorers('2026-2027').subscribe((result) => (scorers = result));
    const request = http.expectOne((r) => r.url === `${api}/scorers`);
    expect(request.request.params.get('filters[goals][$gt]')).toBe('0');
    request.flush(
      page([
        { name: 'Eigentor', goals: 1, player: null },
        {
          name: 'Stefan Jaindl',
          goals: 3,
          player: {
            firstName: 'Stefan',
            lastName: 'Jaindl',
            image: {
              url: '/uploads/j.jpg',
              formats: { thumbnail: { url: '/uploads/t_j.jpg', width: 245, height: 300 } },
            },
          },
        },
      ])
    );
    expect(scorers).toEqual([
      { name: 'Stefan Jaindl', goals: 3, imageUrl: `${environment.cmsUrl}/uploads/t_j.jpg` },
      { name: 'Eigentor', goals: 1, imageUrl: null },
    ]);
  });
});
