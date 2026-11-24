import { MatchInfo } from './match-info';

export interface Video {
  /** YouTube embed URL. */
  url: string;
  /** Score after the goal ("2:0") or a free text. */
  description: string | null;
  /** Full name of the scorer, "Eigentor", or null for highlights. */
  scorer: string | null;
}

/** A match (or event) with its videos. */
export interface MatchVideos {
  match: MatchInfo;
  videos: Video[];
}
