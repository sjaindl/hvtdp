/** "Event": not a match but e.g. the Entenrennen; it has a title instead of teams (videos page only). */
export type Competition = 'Meisterschaft' | 'Cup' | 'Testspiel' | 'Event';

/** A goal scorer of a match: player name (or e.g. "Eigentor") and number of goals. */
export interface MatchGoal {
  name: string;
  count: number;
}

export interface MatchInfo {
  /** Strapi id; increases with creation, used as tie-breaker when sorting. */
  id: number;
  /** Season key, e.g. "2026-2027". */
  season: string;
  competition: Competition;
  round: number | null;
  stage: string | null;
  /** Title of an event (e.g. "1. Entenrennen Stainz"); null for matches. */
  title: string | null;
  /** Display label built from competition, round and stage, e.g. "5. Runde", "Cup Achtelfinale". */
  label: string;
  /** Local kickoff; null when the date is not known yet. */
  kickoff: Date | null;
  /** False when only the date is known (kickoff is then midnight). */
  hasTime: boolean;
  venue: string | null;
  /** Empty for events. */
  homeTeam: string;
  awayTeam: string;
  /** Null until the match has been played. */
  homeScore: number | null;
  awayScore: number | null;
  additionalInfo: string | null;
  goals: MatchGoal[];
}
