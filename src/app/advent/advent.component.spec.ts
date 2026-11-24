import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { AdventComponent } from './advent.component';

describe('AdventComponent', () => {
  let component: AdventComponent;
  let fixture: ComponentFixture<AdventComponent>;
  let http: HttpTestingController;
  const url = `${environment.cmsUrl}/api/advent-calendars`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdventComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('shows the newest calendar without a year in the URL', () => {
    http
      .expectOne((r) => r.url === url && r.params.get('fields[0]') === 'year')
      .flush(page([{ year: '2023' }, { year: '2021' }]));
    expect(component.season).toBe('2023');
    expect(component.seasons).toEqual(['2023', '2021']);
    const request = http.expectOne((r) => r.url === url && r.params.has('filters[year][$eq]'));
    expect(request.request.params.get('filters[year][$eq]')).toBe('2023');
    request.flush(
      page([
        {
          year: '2023',
          title: 'Tor-Adventkalender',
          lead: 'Tore!',
          note: null,
          doors: [
            { day: 3, poster: { url: '/uploads/p3.jpg' }, video: { url: '/uploads/v3.mp4' } },
          ],
        },
      ])
    );
    expect(component.text.title).toBe('Tor-Adventkalender');
    expect(component.video(3)).toBe(`${environment.cmsUrl}/uploads/v3.mp4`);
    expect(component.poster(4)).toBe('');
  });
});
