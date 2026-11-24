import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideTestDependencies } from '../../testing/test-providers';
import { ChampionshipService } from '../services/championship.service';
import { CmsService } from '../services/cms.service';
import { MatchInfo } from '../shared/match-info';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let championship: jasmine.SpyObj<ChampionshipService>;
  let cms: jasmine.SpyObj<CmsService>;

  beforeEach(async () => {
    championship = jasmine.createSpyObj<ChampionshipService>('ChampionshipService', [
      'getLastResult',
      'getNextMatch',
    ]);
    const lastResult: MatchInfo = {
      id: 71,
      season: '2026-2027',
      competition: 'Meisterschaft',
      round: 3,
      stage: null,
      title: null,
      label: '3. Runde',
      kickoff: new Date(2026, 8, 19, 15),
      hasTime: true,
      venue: null,
      homeTeam: 'HV TDP Stainz',
      awayTeam: 'SV Gast',
      homeScore: 2,
      awayScore: 1,
      additionalInfo: null,
      goals: [],
    };
    championship.getLastResult.and.returnValue(of(lastResult));
    championship.getNextMatch.and.returnValue(of(null));
    cms = jasmine.createSpyObj<CmsService>('CmsService', [
      'getNews',
      'getMatchReport',
      'getSingle',
    ]);
    cms.getNews.and.returnValue(of([]));
    cms.getMatchReport.and.returnValue(of(8));
    cms.getSingle.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        ...provideTestDependencies(),
        { provide: ChampionshipService, useValue: championship },
        { provide: CmsService, useValue: cms },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads only the newest five news', () => {
    expect(cms.getNews).toHaveBeenCalledWith(5);
  });

  it('links the last result to its match report', () => {
    expect(component.lastResult?.id).toBe(71);
    expect(cms.getMatchReport).toHaveBeenCalledWith(71);
    expect(component.reportNewsId).toBe(8);
  });
});
