import { MatchInfo } from '../match-info';
import { MatchUtil, OWN_TEAM } from './match.util';

const match = (overrides: Partial<MatchInfo> = {}): MatchInfo => ({
  id: 1,
  season: '2026-2027',
  competition: 'Meisterschaft',
  round: 1,
  stage: null,
  title: null,
  label: '1. Runde',
  kickoff: new Date(2026, 8, 19, 15, 30),
  hasTime: true,
  venue: null,
  homeTeam: OWN_TEAM,
  awayTeam: 'SV Gegner',
  homeScore: null,
  awayScore: null,
  additionalInfo: null,
  goals: [],
  ...overrides,
});

describe('MatchUtil', () => {
  it('knows whether a match has been played', () => {
    expect(MatchUtil.hasScore(match({ homeScore: 2, awayScore: 0 }))).toBeTrue();
    expect(MatchUtil.hasScore(match({ homeScore: 0, awayScore: 0 }))).toBeTrue();
    expect(MatchUtil.hasScore(match({ homeScore: 2, awayScore: null }))).toBeFalse();
  });

  describe('outcome', () => {
    it('rates the result from the point of view of the own team at home', () => {
      expect(MatchUtil.outcome(match({ homeScore: 3, awayScore: 1 }))).toBe('Sieg');
      expect(MatchUtil.outcome(match({ homeScore: 1, awayScore: 3 }))).toBe('Niederlage');
      expect(MatchUtil.outcome(match({ homeScore: 2, awayScore: 2 }))).toBe('Remis');
    });

    it('rates the result from the point of view of the own team away', () => {
      const away = { homeTeam: 'SV Gegner', awayTeam: ` ${OWN_TEAM} ` };
      expect(MatchUtil.outcome(match({ ...away, homeScore: 1, awayScore: 3 }))).toBe('Sieg');
      expect(MatchUtil.outcome(match({ ...away, homeScore: 3, awayScore: 1 }))).toBe('Niederlage');
    });

    it('has no outcome for matches not played yet', () => {
      expect(MatchUtil.outcome(match())).toBeNull();
    });
  });

  describe('lastResult / nextMatch', () => {
    const played = match({ id: 1, kickoff: new Date(2026, 8, 5, 15), homeScore: 2, awayScore: 1 });
    const playedLater = match({
      id: 2,
      kickoff: new Date(2026, 8, 12, 15),
      homeScore: 0,
      awayScore: 0,
    });
    const upcoming = match({ id: 3, kickoff: new Date(2026, 8, 26, 15) });
    const upcomingLater = match({ id: 4, kickoff: new Date(2026, 9, 10, 15) });
    const missedWithoutScore = match({ id: 5, kickoff: new Date(2026, 7, 29, 15) });
    const all = [upcomingLater, played, missedWithoutScore, upcoming, playedLater];

    it('finds the most recent played match', () => {
      expect(MatchUtil.lastResult(all)).toBe(playedLater);
      expect(MatchUtil.lastResult([upcoming])).toBeNull();
    });

    it('finds the earliest match that has not started yet', () => {
      expect(MatchUtil.nextMatch(all, new Date(2026, 8, 20))).toBe(upcoming);
      expect(MatchUtil.nextMatch(all, new Date(2026, 8, 27))).toBe(upcomingLater);
      expect(MatchUtil.nextMatch(all, new Date(2026, 11, 1))).toBeNull();
    });

    it('ignores matches without a date', () => {
      expect(MatchUtil.nextMatch([match({ kickoff: null })], new Date(2026, 0, 1))).toBeNull();
    });

    it('sorts newest first and matches without date by creation order', () => {
      const olderA = match({ id: 7, kickoff: null });
      const olderB = match({ id: 8, kickoff: null });
      expect(MatchUtil.sortNewestFirst([played, olderA, playedLater, olderB])).toEqual([
        playedLater,
        played,
        olderB,
        olderA,
      ]);
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time for display', () => {
      expect(MatchUtil.formatDateTime(match())).toBe('Sa, 19.09.2026 · 15:30 Uhr');
    });

    it('leaves out the time when only the date is known', () => {
      expect(
        MatchUtil.formatDateTime(match({ kickoff: new Date(2026, 8, 19), hasTime: false }))
      ).toBe('Sa, 19.09.2026');
    });

    it('is empty without a date', () => {
      expect(MatchUtil.formatDateTime(match({ kickoff: null }))).toBe('');
    });
  });

  it('builds the scorer text', () => {
    expect(
      MatchUtil.goalsLabel([
        { name: 'Paschek', count: 2 },
        { name: 'Jaindl', count: 1 },
      ])
    ).toBe('Paschek (2), Jaindl');
    expect(MatchUtil.goalsLabel([])).toBe('');
  });

  it('builds the match label from competition, round and stage', () => {
    expect(MatchUtil.label({ competition: 'Meisterschaft', round: 5, stage: null })).toBe(
      '5. Runde'
    );
    expect(
      MatchUtil.label({ competition: 'Meisterschaft', round: 5, stage: 'Nachtragsspiel' })
    ).toBe('Nachtragsspiel, 5. Runde');
    expect(MatchUtil.label({ competition: 'Cup', round: 1, stage: null })).toBe('Cup 1. Runde');
    expect(MatchUtil.label({ competition: 'Cup', round: null, stage: 'Achtelfinale' })).toBe(
      'Cup Achtelfinale'
    );
    expect(MatchUtil.label({ competition: 'Cup', round: null, stage: null })).toBe('Cup');
    expect(MatchUtil.label({ competition: 'Testspiel', round: null, stage: null })).toBe(
      'Testspiel'
    );
    expect(MatchUtil.label({ competition: 'Event', round: null, stage: null })).toBe('Event');
  });

  it('builds team initials from the first two words with letters', () => {
    expect(MatchUtil.initials('SV Gegner')).toBe('SG');
    expect(MatchUtil.initials('1. FC Stainz Nord')).toBe('FS');
    expect(MatchUtil.initials('Union')).toBe('U');
  });
});
