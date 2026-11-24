import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { PlayerOfTheSeasonComponent } from './playeroftheseason.component';

describe('PlayerOfTheSeasonComponent', () => {
  let component: PlayerOfTheSeasonComponent;
  let fixture: ComponentFixture<PlayerOfTheSeasonComponent>;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerOfTheSeasonComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerOfTheSeasonComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the newest voting without a year in the URL, players sorted by last name', () => {
    http
      .expectOne((r) => r.url === `${api}/polls`)
      .flush(page([{ type: 'playerOfTheYear', year: '2026', open: false, surveyUrl: null }]));
    expect(component.season).toBe('2026');
    expect(component.votingOpen).toBeFalse();

    http
      .expectOne((r) => r.url === `${api}/poll-options`)
      .flush(
        page([
          {
            documentId: 'p',
            name: null,
            player: { firstName: 'Manfred', lastName: 'Paschek', position: null, image: null },
            video: null,
          },
          {
            documentId: 'j',
            name: null,
            player: { firstName: 'Stefan', lastName: 'Jaindl', position: null, image: null },
            video: null,
          },
        ])
      );
    expect(component.candidates.map((option) => option.name)).toEqual([
      'Stefan Jaindl',
      'Manfred Paschek',
    ]);
  });
});
