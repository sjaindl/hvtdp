import { MatchInfo } from './match-info';
import { Video } from './video';

export type PollType = 'goalOfTheYear' | 'playerOfTheYear' | 'goldenShot';

/** Tor des Jahres / Spieler der Saison of one year. */
export interface Poll {
  type: PollType;
  /** e.g. "2026" */
  year: string;
  /** Only open polls take votes. */
  open: boolean;
  /** Older votings ran on an external survey page. */
  surveyUrl: string | null;
}

/** A goal (video) or a player to vote for. */
export interface PollOption {
  documentId: string;
  /** Player name (or the fallback name). */
  name: string;
  imageUrl: string | null;
  /** Position of the player ("Stürmer"). */
  position: string | null;
  video: Video | null;
  /** Match of the video. */
  match: MatchInfo | null;
}
