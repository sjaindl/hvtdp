import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { News } from '../shared/news';
import { CmsService } from './cms.service';

describe('CmsService', () => {
  let service: CmsService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(CmsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const page = (data: unknown[], pageNumber: number, pageCount: number) => ({
    data,
    meta: { pagination: { page: pageNumber, pageCount } },
  });

  it('collects all pages of a collection with the given query', () => {
    let result: { id: number }[] = [];
    service
      .getCollection<{ id: number }>('players', { 'sort[0]': 'lastName:asc' })
      .subscribe((r) => (result = r));

    const first = http.expectOne(
      (request) =>
        request.url === `${api}/players` && request.params.get('pagination[page]') === '1'
    );
    expect(first.request.params.get('sort[0]')).toBe('lastName:asc');
    expect(first.request.params.get('pagination[pageSize]')).toBe('100');
    first.flush(page([{ id: 1 }, { id: 2 }], 1, 2));

    http
      .expectOne(
        (request) =>
          request.url === `${api}/players` && request.params.get('pagination[page]') === '2'
      )
      .flush(page([{ id: 3 }], 2, 2));

    expect(result.map((entry) => entry.id)).toEqual([1, 2, 3]);
  });

  it('loads the same query only once', () => {
    service.getCollection('players').subscribe();
    service.getCollection('players').subscribe();
    http
      .expectOne(`${api}/players?pagination%5Bpage%5D=1&pagination%5BpageSize%5D=100`)
      .flush(page([], 1, 1));
  });

  it('requests the remaining pages in parallel after the first one', () => {
    let count = 0;
    service.getCollection<{ id: number }>('photos').subscribe((r) => (count = r.length));
    http
      .expectOne((request) => request.params.get('pagination[page]') === '1')
      .flush(page([{ id: 1 }], 1, 3));
    const rest = http.match((request) => request.url === `${api}/photos`);
    expect(rest.map((request) => request.request.params.get('pagination[page]'))).toEqual([
      '2',
      '3',
    ]);
    rest[1].flush(page([{ id: 3 }], 3, 3));
    rest[0].flush(page([{ id: 2 }], 2, 3));
    expect(count).toBe(3);
  });

  it('requests again after a failed load instead of replaying the error', () => {
    let failed = false;
    service.getCollection('documents').subscribe({ error: () => (failed = true) });
    http
      .expectOne((request) => request.url === `${api}/documents`)
      .flush('down', { status: 503, statusText: 'Service Unavailable' });
    expect(failed).toBeTrue();

    let result: unknown[] = [];
    service.getCollection('documents').subscribe((r) => (result = r));
    http.expectOne((request) => request.url === `${api}/documents`).flush(page([{ id: 1 }], 1, 1));
    expect(result).toEqual([{ id: 1 }]);
  });

  it('loads only the first entries with getFirst', () => {
    let result: unknown[] = [];
    service.getFirst('news-items', 5, { 'sort[0]': 'date:desc' }).subscribe((r) => (result = r));
    const request = http.expectOne((r) => r.url === `${api}/news-items`);
    expect(request.request.params.get('pagination[pageSize]')).toBe('5');
    expect(request.request.params.get('pagination[page]')).toBe('1');
    request.flush(page([{ id: 1 }], 1, 4));
    expect(result).toEqual([{ id: 1 }]);
  });

  it('loads a single type and returns null when it does not exist yet', () => {
    let announcement: unknown = undefined;
    service.getSingle('announcement').subscribe((data) => (announcement = data));
    http.expectOne(`${api}/announcement`).flush({ data: { text: 'Hinweis', active: true } });
    expect(announcement).toEqual({ text: 'Hinweis', active: true });

    let missing: unknown = undefined;
    service.getSingle('team-page').subscribe((data) => (missing = data));
    http.expectOne(`${api}/team-page`).flush({ data: null });
    expect(missing).toBeNull();
  });

  it('maps news with absolute image URLs', () => {
    let title = '';
    let imageUrl: string | null = null;
    service.getNews().subscribe(([news]) => {
      title = news.title;
      imageUrl = news.imageUrl;
    });
    http
      .expectOne((request) => request.url === `${api}/news-items`)
      .flush(
        page(
          [
            {
              newsId: 1,
              date: '2026-11-07',
              title: 'Kegelturnier',
              content: null,
              image: { url: '/uploads/a.jpg' },
              homeImage: null,
            },
          ],
          1,
          1
        )
      );
    expect(title).toBe('Kegelturnier');
    expect(imageUrl as string | null).toBe(`${environment.cmsUrl}/uploads/a.jpg`);
  });

  it('maps the news category and the match of a report', () => {
    let result: News[] = [];
    service.getNews().subscribe((news) => (result = news));
    const request = http.expectOne((r) => r.url === `${api}/news-items`);
    expect(request.request.params.get('populate[match][fields][0]')).toBe('round');
    request.flush(
      page(
        [
          {
            newsId: 2,
            date: '2026-10-24',
            title: '5. Runde - STT Pichler : HV TDP Stainz (Spielbericht)',
            content: null,
            image: null,
            homeImage: null,
            category: 'Spielbericht',
            match: { id: 71 },
          },
          {
            newsId: 1,
            date: '2026-11-07',
            title: 'Alte News',
            content: null,
            image: null,
            homeImage: null,
            category: null,
            match: null,
          },
        ],
        1,
        1
      )
    );
    expect(result.map((news) => [news.category, news.matchId])).toEqual([
      ['Spielbericht', 71],
      [null, null],
    ]);
  });
});
