import { MatchInfo } from '../match-info';

export const OWN_TEAM = 'HV TDP Stainz';

export type MatchOutcome = 'Sieg' | 'Remis' | 'Niederlage';

/**
 * Helpers for MatchInfo rows from getMatchInfo.php. The API delivers numbers as strings
 * ("3", "" for not played yet) and dates like "SA, 19.09.2026, 15:30".
 */
export class MatchUtil {
  static hasScore(match: MatchInfo): boolean {
    return MatchUtil.toNumber(match.homeScore) !== null && MatchUtil.toNumber(match.awayScore) !== null;
  }

  static toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  /** Parses "SA, 19.09.2026, 15:30" (time optional). Returns null for missing or unknown formats. */
  static parseDate(dateTime: string | null): Date | null {
    const match = (dateTime ?? '').match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\D+(\d{1,2}):(\d{2}))?/);
    if (!match) {
      return null;
    }
    const [, day, month, year, hours, minutes] = match;
    return new Date(+year, +month - 1, +day, hours ? +hours : 0, minutes ? +minutes : 0);
  }

  static isOwnTeam(team: string | null | undefined): boolean {
    return (team ?? '').trim() === OWN_TEAM;
  }

  static ownTeamPlaysHome(match: MatchInfo): boolean {
    return MatchUtil.isOwnTeam(match.homeTeam);
  }

  static outcome(match: MatchInfo): MatchOutcome | null {
    if (!MatchUtil.hasScore(match)) {
      return null;
    }
    const home = MatchUtil.toNumber(match.homeScore);
    const away = MatchUtil.toNumber(match.awayScore);
    const own = MatchUtil.ownTeamPlaysHome(match) ? home - away : away - home;
    return own > 0 ? 'Sieg' : own < 0 ? 'Niederlage' : 'Remis';
  }

  /** Newest first, using the parsed date and falling back to the row id. */
  static sortNewestFirst(matches: MatchInfo[]): MatchInfo[] {
    return [...matches].sort((a, b) => {
      const dateA = MatchUtil.parseDate(a.dateTime)?.getTime() ?? 0;
      const dateB = MatchUtil.parseDate(b.dateTime)?.getTime() ?? 0;
      return dateB - dateA || Number(b.id ?? 0) - Number(a.id ?? 0);
    });
  }

  static lastResult(matches: MatchInfo[]): MatchInfo | null {
    return MatchUtil.sortNewestFirst(matches).find((match) => MatchUtil.hasScore(match)) ?? null;
  }

  static nextMatch(matches: MatchInfo[], now = new Date()): MatchInfo | null {
    return (
      [...matches]
        .filter((match) => !MatchUtil.hasScore(match))
        .map((match) => ({ match, date: MatchUtil.parseDate(match.dateTime) }))
        .filter(({ date }) => date !== null && date.getTime() >= now.getTime())
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0]?.match ?? null
    );
  }

  /** "SA, 19.09.2026, 15:30" -> "Sa, 19.09.2026 · 15:30 Uhr" */
  static formatDateTime(dateTime: string | null): string {
    const date = MatchUtil.parseDate(dateTime);
    if (!date) {
      return dateTime ?? '';
    }
    const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
    const day = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hasTime = /\d{1,2}:\d{2}/.test(dateTime ?? '');
    const time = hasTime
      ? ` · ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
      : '';
    return `${weekday}, ${day}${time}`;
  }

  static initials(team: string): string {
    const words = team.split(/\s+/).filter((word) => /\p{L}/u.test(word));
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }
}
