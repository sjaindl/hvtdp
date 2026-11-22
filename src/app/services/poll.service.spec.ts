import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { Poll, PollOption } from '../shared/poll';
import { PollService } from './poll.service';

describe('PollService', () => {
  let service: PollService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(PollService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the polls of a type, newest year first', () => {
    let polls: Poll[] = [];
    service.getPolls('goalOfTheYear').subscribe((result) => (polls = result));
    const request = http.expectOne((r) => r.url === `${api}/polls`);
    expect(request.request.params.get('filters[type][$eq]')).toBe('goalOfTheYear');
    expect(request.request.params.get('sort[0]')).toBe('year:desc');
    request.flush(
      page([{ type: 'goalOfTheYear', year: '2023', open: null, surveyUrl: 'https://survey' }])
    );
    expect(polls).toEqual([
      { type: 'goalOfTheYear', year: '2023', open: false, surveyUrl: 'https://survey' },
    ]);
  });

  it('maps goal options with video and match, player options with portrait', () => {
    let options: PollOption[] = [];
    service.getOptions('goalOfTheYear', '2026').subscribe((result) => (options = result));
    const request = http.expectOne((r) => r.url === `${api}/poll-options`);
    expect(request.request.params.get('filters[poll][year][$eq]')).toBe('2026');
    expect(
      request.request.params.get('populate[video][populate][match][populate][season][fields][0]')
    ).toBe('key');
    request.flush(
      page([
        {
          documentId: 'goal',
          name: null,
          player: {
            firstName: 'Stefan',
            lastName: 'Jaindl',
            position: 'Stürmer',
            image: {
              url: '/uploads/j.jpg',
              formats: { thumbnail: { url: '/uploads/t_j.jpg', width: 1, height: 1 } },
            },
          },
          video: {
            documentId: 'v',
            url: 'https://www.youtube.com/embed/b',
            description: '2:0',
            name: null,
            order: 1,
            player: { firstName: 'Stefan', lastName: 'Jaindl' },
            match: {
              id: 5,
              season: { key: '2026-2027' },
              competition: 'Meisterschaft',
              round: 2,
              stage: null,
              title: null,
              date: '2026-09-12',
              time: null,
              venue: null,
              homeTeam: 'HV TDP Stainz',
              awayTeam: 'STT Pichler',
              homeScore: 3,
              awayScore: 3,
              additionalInfo: null,
            },
          },
        },
        { documentId: 'other', name: 'Ehemaliger Spieler', player: null, video: null },
      ])
    );

    const [goal, other] = options;
    expect(goal.name).toBe('Stefan Jaindl');
    expect(goal.imageUrl).toBe(`${environment.cmsUrl}/uploads/t_j.jpg`);
    expect(goal.position).toBe('Stürmer');
    expect(goal.video).toEqual({
      url: 'https://www.youtube.com/embed/b',
      description: '2:0',
      scorer: 'Stefan Jaindl',
    });
    expect(goal.match?.label).toBe('2. Runde');
    expect(goal.match?.kickoff).toEqual(new Date(2026, 8, 12));
    expect(other).toEqual({
      documentId: 'other',
      name: 'Ehemaliger Spieler',
      imageUrl: null,
      position: null,
      video: null,
      match: null,
    });
  });

  it('posts a vote for an option', () => {
    service.vote({ documentId: 'abc' } as PollOption).subscribe();
    const request = http.expectOne(`${api}/poll-options/abc/vote`);
    expect(request.request.method).toBe('POST');
    request.flush({ ok: true });
  });
});
