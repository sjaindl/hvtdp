import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { MatchVideos } from '../shared/video';
import { VideoService } from './video.service';

describe('VideoService', () => {
  let service: VideoService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });
  const match = (overrides: object) => ({
    id: 1,
    season: { key: '2026-2027' },
    competition: 'Meisterschaft',
    round: null,
    stage: null,
    title: null,
    date: null,
    time: null,
    venue: null,
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    additionalInfo: null,
    goals: [],
    videos: [],
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(VideoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads matches and events with videos, newest first, with the scorer names', () => {
    let result: MatchVideos[] = [];
    service.getMatchVideos().subscribe((items) => (result = items));
    const request = http.expectOne((r) => r.url === `${api}/matches`);
    expect(request.request.params.get('filters[videos][id][$notNull]')).toBe('true');
    request.flush(
      page([
        match({
          id: 10,
          competition: 'Event',
          title: '1. Entenrennen Stainz',
          date: '2021-09-16',
          videos: [
            { url: 'https://www.youtube.com/embed/a', description: null, name: null, player: null },
          ],
        }),
        match({
          id: 20,
          round: 2,
          date: '2026-09-12',
          homeTeam: 'HV TDP Stainz',
          awayTeam: 'STT Pichler',
          homeScore: 3,
          awayScore: 3,
          videos: [
            {
              url: 'https://www.youtube.com/embed/b',
              description: '1:0',
              name: null,
              player: { firstName: 'Stefan', lastName: 'Jaindl' },
            },
            {
              url: 'https://www.youtube.com/embed/c',
              description: '1:1',
              name: 'Eigentor',
              player: null,
            },
          ],
        }),
      ])
    );

    expect(result.map((item) => item.match.id)).toEqual([20, 10]);
    expect(result[0].match.label).toBe('2. Runde');
    expect(result[0].videos.map((video) => video.scorer)).toEqual(['Stefan Jaindl', 'Eigentor']);
    expect(result[1].match.title).toBe('1. Entenrennen Stainz');
    expect(result[1].videos[0].scorer).toBeNull();
  });
});
