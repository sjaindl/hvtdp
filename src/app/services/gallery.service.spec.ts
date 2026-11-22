import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { Album, AlbumWithPhotos } from '../shared/photos';
import { GalleryService } from './gallery.service';

describe('GalleryService', () => {
  let service: GalleryService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });
  const formats = (name: string) => ({
    small: { url: `/uploads/small_${name}`, width: 500, height: 375 },
    medium: { url: `/uploads/medium_${name}`, width: 1000, height: 750 },
    large: { url: `/uploads/large_${name}`, width: 1600, height: 1200 },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(GalleryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists the album years newest first', () => {
    let years: string[] = [];
    service.getYears().subscribe((result) => (years = result));
    http
      .expectOne((r) => r.url === `${api}/albums`)
      .flush(page([{ year: '2023' }, { year: '2026' }, { year: '2023' }]));
    expect(years).toEqual(['2026', '2023']);
  });

  it('loads the albums of a year with a small cover and the photo count only', () => {
    let albums: Album[] = [];
    service.getAlbums('2026').subscribe((result) => (albums = result));
    const request = http.expectOne((r) => r.url === `${api}/albums`);
    expect(request.request.params.get('filters[year][$eq]')).toBe('2026');
    expect(request.request.params.get('populate[photos][fields][0]')).toBe('id');
    request.flush(
      page([
        {
          name: '4. Boccia Turnier',
          slug: '4-boccia-turnier',
          year: '2026',
          date: '2026-08-22',
          cover: { url: '/uploads/a.jpg', formats: formats('a.jpg') },
          photos: [{ id: 1 }, { id: 2 }],
        },
        { name: 'Ohne Titelbild', slug: null, year: '2026', date: null, cover: null, photos: null },
      ])
    );
    expect(albums).toEqual([
      {
        name: '4. Boccia Turnier',
        slug: '4-boccia-turnier',
        year: '2026',
        date: '2026-08-22',
        coverUrl: `${environment.cmsUrl}/uploads/small_a.jpg`,
        photoCount: 2,
      },
      { name: 'Ohne Titelbild', slug: '', year: '2026', date: null, coverUrl: null, photoCount: 0 },
    ]);
  });

  it('loads one album with medium photos, large viewer images, ratio and real captions', () => {
    let album: AlbumWithPhotos | null = null;
    service.getAlbum('2015', 'kleinfeldturnier').subscribe((result) => (album = result));
    const request = http.expectOne((r) => r.url === `${api}/albums`);
    expect(request.request.params.get('filters[slug][$eq]')).toBe('kleinfeldturnier');
    request.flush(
      page([
        {
          name: 'Kleinfeldturnier',
          slug: 'kleinfeldturnier',
          year: '2015',
          date: '2015-07-11',
          cover: null,
          photos: [
            {
              url: '/uploads/p1.jpg',
              width: 1600,
              height: 1200,
              caption: '1. Platz: FC Bazinga',
              formats: formats('p1.jpg'),
            },
            {
              url: '/uploads/p2.jpg',
              width: 300,
              height: 600,
              caption: 'Kleinfeldturnier',
              formats: null,
            },
          ],
        },
      ])
    );
    expect(album!.photos).toEqual([
      {
        url: `${environment.cmsUrl}/uploads/medium_p1.jpg`,
        fullUrl: `${environment.cmsUrl}/uploads/large_p1.jpg`,
        ratio: 1.333,
        caption: '1. Platz: FC Bazinga',
      },
      {
        url: `${environment.cmsUrl}/uploads/p2.jpg`,
        fullUrl: `${environment.cmsUrl}/uploads/p2.jpg`,
        ratio: 0.5,
        caption: null,
      },
    ]);
  });

  it('returns null for an unknown album', () => {
    let album: AlbumWithPhotos | null | undefined;
    service.getAlbum('2026', 'gibt-es-nicht').subscribe((result) => (album = result));
    http.expectOne((r) => r.url === `${api}/albums`).flush(page([]));
    expect(album).toBeNull();
  });
});
