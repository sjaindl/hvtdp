import { MatchGoal, MatchInfo } from '../match-info';

export const OWN_TEAM = 'HV TDP Stainz';

export type MatchOutcome = 'Sieg' | 'Remis' | 'Niederlage';

/** Helpers for matches (results, next match, display texts). */
export class MatchUtil {
  static hasScore(match: MatchInfo): boolean {
    return match.homeScore !== null && match.awayScore !== null;
  }

  static isOwnTeam(team: string | null | undefined): boolean {
    return (team ?? '').trim() === OWN_TEAM;
  }

  static ownTeamPlaysHome(match: MatchInfo): boolean {
    return MatchUtil.isOwnTeam(match.homeTeam);
  }

  static outcome(match: MatchInfo): MatchOutcome | null {
    const { homeScore: home, awayScore: away } = match;
    if (home === null || away === null) {
      return null;
    }
    const own = MatchUtil.ownTeamPlaysHome(match) ? home - away : away - home;
    return own > 0 ? 'Sieg' : own < 0 ? 'Niederlage' : 'Remis';
  }

  /** Newest first by kickoff; matches without date (older seasons) by creation order. */
  static sortNewestFirst(matches: MatchInfo[]): MatchInfo[] {
    return [...matches].sort(MatchUtil.compareNewestFirst);
  }

  /** Newest kickoff first; matches without a date last, by creation order. */
  static compareNewestFirst(a: MatchInfo, b: MatchInfo): number {
    return (b.kickoff?.getTime() ?? 0) - (a.kickoff?.getTime() ?? 0) || b.id - a.id;
  }

  static lastResult(matches: MatchInfo[]): MatchInfo | null {
    return MatchUtil.sortNewestFirst(matches).find((match) => MatchUtil.hasScore(match)) ?? null;
  }

  /** The earliest match that has not been played and has not started yet. */
  static nextMatch(matches: MatchInfo[], now = new Date()): MatchInfo | null {
    return (
      matches
        .filter(
          (match): match is MatchInfo & { kickoff: Date } =>
            !MatchUtil.hasScore(match) &&
            match.kickoff !== null &&
            match.kickoff.getTime() >= now.getTime()
        )
        .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime())[0] ?? null
    );
  }

  /** "Sa, 19.09.2026 · 15:30 Uhr" (without the time part when only the date is known). */
  static formatDateTime(match: Pick<MatchInfo, 'kickoff' | 'hasTime'>): string {
    const date = match.kickoff;
    if (!date) {
      return '';
    }
    const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
    const day = date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = match.hasTime
      ? ` · ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
      : '';
    return `${weekday}, ${day}${time}`;
  }

  /** "Paschek (2), Jaindl" */
  static goalsLabel(goals: MatchGoal[]): string {
    return goals
      .map((goal) => (goal.count > 1 ? `${goal.name} (${goal.count})` : goal.name))
      .join(', ');
  }

  /** "5. Runde", "Nachtragsspiel, 5. Runde", "Cup 1. Runde", "Cup Achtelfinale", "Testspiel"; events: "Event". */
  static label(match: Pick<MatchInfo, 'competition' | 'round' | 'stage'>): string {
    if (match.competition === 'Event') {
      return 'Event';
    }
    const round = match.round ? `${match.round}. Runde` : '';
    if (match.competition === 'Cup') {
      return ['Cup', round, match.stage].filter(Boolean).join(' ');
    }
    if (match.competition === 'Testspiel') {
      return match.stage ? `Testspiel ${match.stage}` : 'Testspiel';
    }
    return [match.stage, round].filter(Boolean).join(', ') || 'Meisterschaft';
  }

  static initials(team: string): string {
    const words = team.split(/\s+/).filter((word) => /\p{L}/u.test(word));
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }
}
