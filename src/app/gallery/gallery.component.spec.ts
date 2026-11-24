import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let http: HttpTestingController;
  let params: BehaviorSubject<Params>;
  const albumsUrl = `${environment.cmsUrl}/api/albums`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });
  const years = () =>
    http
      .expectOne((r) => r.url === albumsUrl && r.params.get('fields[0]') === 'year')
      .flush(page([{ year: '2026' }, { year: '2023' }]));

  beforeEach(async () => {
    params = new BehaviorSubject<Params>({});
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [...provideTestDependencies(), { provide: ActivatedRoute, useValue: { params } }],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  it('shows the albums of the newest year without a year in the URL', () => {
    fixture.detectChanges();
    years();
    expect(component.season).toBe('2026');
    expect(component.seasons).toEqual(['2026', '2023']);
    const request = http.expectOne(
      (r) => r.url === albumsUrl && r.params.has('filters[year][$eq]')
    );
    expect(request.request.params.get('filters[year][$eq]')).toBe('2026');
    request.flush(
      page([{ name: 'Boccia', slug: 'boccia', year: '2026', date: null, cover: null, photos: [] }])
    );
    expect(component.albums.map((album) => album.slug)).toEqual(['boccia']);
    expect(component.selectedAlbum).toBeNull();
  });

  it('opens an album by year and slug', () => {
    params.next({ season: '2023', albumId: 'weihnachtsfeier-2023' });
    fixture.detectChanges();
    years();
    const request = http.expectOne(
      (r) => r.url === albumsUrl && r.params.has('filters[slug][$eq]')
    );
    expect(request.request.params.get('filters[year][$eq]')).toBe('2023');
    request.flush(
      page([
        {
          name: 'Weihnachtsfeier 2023',
          slug: 'weihnachtsfeier-2023',
          year: '2023',
          date: '2023-11-11',
          cover: null,
          photos: [
            { url: '/uploads/1.jpg', width: 400, height: 300, caption: null, formats: null },
          ],
        },
      ])
    );
    expect(component.selectedAlbum?.name).toBe('Weihnachtsfeier 2023');
    expect(component.photos.length).toBe(1);
  });

  it('knows when an album link does not exist (shows "Album nicht gefunden")', () => {
    params.next({ season: '2023', albumId: 'gibt-es-nicht' });
    fixture.detectChanges();
    years();
    http
      .expectOne((r) => r.url === albumsUrl && r.params.has('filters[slug][$eq]'))
      .flush(page([]));
    expect(component.loaded).toBeTrue();
    expect(component.selectedAlbumSlug).toBe('gibt-es-nicht');
    expect(component.selectedAlbum).toBeNull();
  });
});
