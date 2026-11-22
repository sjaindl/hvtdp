import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../../testing/test-providers';
import { MatchInfo } from '../../shared/match-info';
import { OWN_TEAM } from '../../shared/utils/match.util';
import { NextMatchComponent } from './next-match.component';

describe('NextMatchComponent', () => {
  let fixture: ComponentFixture<NextMatchComponent>;

  const create = (dateTime: string | null) => {
    fixture = TestBed.createComponent(NextMatchComponent);
    fixture.componentRef.setInput('match', {
      id: 1,
      season: '2026-2027',
      matchInfo: '',
      dateTime,
      venue: null,
      homeTeam: OWN_TEAM,
      awayTeam: 'SV Gegner',
      homeScore: null,
      awayScore: null,
      additionalInfo: null,
    } satisfies MatchInfo);
    fixture.detectChanges();
    return fixture.componentInstance;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextMatchComponent],
      providers: provideTestDependencies(),
    }).compileComponents();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 8, 18, 12, 0, 0));
  });

  afterEach(() => {
    fixture.destroy();
    jasmine.clock().uninstall();
  });

  it('counts down days, hours, minutes and seconds to kickoff', () => {
    const component = create('SA, 19.09.2026, 15:30');
    expect(component.countdown?.map((part) => `${part.value} ${part.label}`)).toEqual([
      '01 Tage',
      '03 Std',
      '30 Min',
      '00 Sek',
    ]);
  });

  it('updates the countdown every second', () => {
    const component = create('SA, 19.09.2026, 15:30');
    jasmine.clock().tick(1000);
    expect(component.countdown?.[3].value).toBe('59');
  });

  it('shows no countdown once the match has started or without a date', () => {
    expect(create('FR, 18.09.2026, 11:00').countdown).toBeNull();
    fixture.destroy();
    expect(create(null).countdown).toBeNull();
  });

  it('knows whether the own team plays at home', () => {
    const component = create('SA, 19.09.2026, 15:30');
    expect(component.isHome).toBeTrue();
    expect(component.dateLabel).toBe('Sa, 19.09.2026 · 15:30 Uhr');
  });
});
