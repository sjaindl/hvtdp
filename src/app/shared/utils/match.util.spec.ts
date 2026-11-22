import { MatchInfo } from '../match-info';
import { MatchUtil, OWN_TEAM } from './match.util';

/** The API sends scores as strings ("3", "" when not played yet). */
const match = (overrides: Partial<Record<keyof MatchInfo, unknown>> = {}): MatchInfo =>
  ({
    id: 1,
    season: '2026-2027',
    matchInfo: '',
    dateTime: 'SA, 19.09.2026, 15:30',
    venue: null,
    homeTeam: OWN_TEAM,
    awayTeam: 'SV Gegner',
    homeScore: '',
    awayScore: '',
    additionalInfo: null,
    ...overrides,
  }) as MatchInfo;

describe('MatchUtil', () => {
  describe('toNumber / hasScore', () => {
    it('reads numbers sent as strings', () => {
      expect(MatchUtil.toNumber('3')).toBe(3);
      expect(MatchUtil.toNumber('0')).toBe(0);
      expect(MatchUtil.toNumber(2)).toBe(2);
    });

    it('treats empty, missing and invalid values as no number', () => {
      expect(MatchUtil.toNumber('')).toBeNull();
      expect(MatchUtil.toNumber(null)).toBeNull();
      expect(MatchUtil.toNumber(undefined)).toBeNull();
      expect(MatchUtil.toNumber('abc')).toBeNull();
    });

    it('knows whether a match has been played', () => {
      expect(MatchUtil.hasScore(match({ homeScore: '2', awayScore: '0' }))).toBeTrue();
      expect(MatchUtil.hasScore(match({ homeScore: '0', awayScore: '0' }))).toBeTrue();
      expect(MatchUtil.hasScore(match({ homeScore: '2', awayScore: '' }))).toBeFalse();
    });
  });

  describe('parseDate', () => {
    it('parses the API format with time', () => {
      expect(MatchUtil.parseDate('SA, 19.09.2026, 15:30')).toEqual(new Date(2026, 8, 19, 15, 30));
    });

    it('parses dates without time as midnight', () => {
      expect(MatchUtil.parseDate('19.09.2026')).toEqual(new Date(2026, 8, 19));
    });

    it('returns null for missing or unknown formats', () => {
      expect(MatchUtil.parseDate(null)).toBeNull();
      expect(MatchUtil.parseDate('')).toBeNull();
      expect(MatchUtil.parseDate('demnächst')).toBeNull();
    });
  });

  describe('outcome', () => {
    it('rates the result from the point of view of the own team at home', () => {
      expect(MatchUtil.outcome(match({ homeScore: '3', awayScore: '1' }))).toBe('Sieg');
      expect(MatchUtil.outcome(match({ homeScore: '1', awayScore: '3' }))).toBe('Niederlage');
      expect(MatchUtil.outcome(match({ homeScore: '2', awayScore: '2' }))).toBe('Remis');
    });

    it('rates the result from the point of view of the own team away', () => {
      const away = { homeTeam: 'SV Gegner', awayTeam: ` ${OWN_TEAM} ` };
      expect(MatchUtil.outcome(match({ ...away, homeScore: '1', awayScore: '3' }))).toBe('Sieg');
      expect(MatchUtil.outcome(match({ ...away, homeScore: '3', awayScore: '1' }))).toBe('Niederlage');
    });

    it('has no outcome for matches not played yet', () => {
      expect(MatchUtil.outcome(match())).toBeNull();
    });
  });

  describe('lastResult / nextMatch', () => {
    const played = match({ id: 1, dateTime: 'SA, 05.09.2026, 15:00', homeScore: '2', awayScore: '1' });
    const playedLater = match({ id: 2, dateTime: 'SA, 12.09.2026, 15:00', homeScore: '0', awayScore: '0' });
    const upcoming = match({ id: 3, dateTime: 'SA, 26.09.2026, 15:00' });
    const upcomingLater = match({ id: 4, dateTime: 'SA, 10.10.2026, 15:00' });
    const missedWithoutScore = match({ id: 5, dateTime: 'SA, 29.08.2026, 15:00' });
    const all = [upcomingLater, played, missedWithoutScore, upcoming, playedLater];

    it('finds the most recent played match', () => {
      expect(MatchUtil.lastResult(all)).toBe(playedLater);
      expect(MatchUtil.lastResult([upcoming])).toBeNull();
    });

    it('finds the earliest match that has not started yet', () => {
      const now = new Date(2026, 8, 20);
      expect(MatchUtil.nextMatch(all, now)).toBe(upcoming);
      expect(MatchUtil.nextMatch(all, new Date(2026, 8, 27))).toBe(upcomingLater);
      expect(MatchUtil.nextMatch(all, new Date(2026, 11, 1))).toBeNull();
    });

    it('ignores matches without a readable date', () => {
      expect(MatchUtil.nextMatch([match({ dateTime: null })], new Date(2026, 0, 1))).toBeNull();
    });

    it('sorts newest first and uses the id when dates are equal', () => {
      const sameDayA = match({ id: 7, dateTime: null });
      const sameDayB = match({ id: 8, dateTime: null });
      expect(MatchUtil.sortNewestFirst([played, sameDayA, playedLater, sameDayB])).toEqual([
        playedLater,
        played,
        sameDayB,
        sameDayA,
      ]);
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time for display', () => {
      expect(MatchUtil.formatDateTime('SA, 19.09.2026, 15:30')).toBe('Sa, 19.09.2026 · 15:30 Uhr');
    });

    it('leaves out the time when there is none', () => {
      expect(MatchUtil.formatDateTime('19.09.2026')).toBe('Sa, 19.09.2026');
    });

    it('keeps unknown formats as they are', () => {
      expect(MatchUtil.formatDateTime('noch offen')).toBe('noch offen');
      expect(MatchUtil.formatDateTime(null)).toBe('');
    });
  });

  it('builds team initials from the first two words with letters', () => {
    expect(MatchUtil.initials('SV Gegner')).toBe('SG');
    expect(MatchUtil.initials('1. FC Stainz Nord')).toBe('FS');
    expect(MatchUtil.initials('Union')).toBe('U');
  });
});
