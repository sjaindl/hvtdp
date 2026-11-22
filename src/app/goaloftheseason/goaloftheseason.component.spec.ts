import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { GoalOfTheSeasonComponent } from './goaloftheseason.component';

describe('GoalOfTheSeasonComponent', () => {
  let component: GoalOfTheSeasonComponent;
  let fixture: ComponentFixture<GoalOfTheSeasonComponent>;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalOfTheSeasonComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(GoalOfTheSeasonComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the newest voting without a year in the URL and splits goals from options without video', () => {
    http
      .expectOne((r) => r.url === `${api}/polls`)
      .flush(
        page([
          { type: 'goalOfTheYear', year: '2026', open: true, surveyUrl: null },
          { type: 'goalOfTheYear', year: '2023', open: false, surveyUrl: 'https://survey' },
        ])
      );
    expect(component.season).toBe('2026');
    expect(component.votingOpen).toBeTrue();
    expect(component.surveyLink).toBeNull();

    const request = http.expectOne((r) => r.url === `${api}/poll-options`);
    expect(request.request.params.get('filters[poll][year][$eq]')).toBe('2026');
    request.flush(
      page([
        { documentId: 'a', name: 'Christian Maderthoner', player: null, video: null },
        {
          documentId: 'b',
          name: null,
          player: null,
          video: {
            documentId: 'v',
            url: 'https://www.youtube.com/embed/b',
            description: '2:0',
            name: 'Eigentor',
            player: null,
            match: null,
          },
        },
      ])
    );
    expect(component.candidates.map((option) => option.documentId)).toEqual(['b']);
    expect(component.optionsWithoutVideo.map((option) => option.name)).toEqual([
      'Christian Maderthoner',
    ]);
  });
});
