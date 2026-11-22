import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
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
});
