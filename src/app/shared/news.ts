export type NewsCategory = 'Spielbericht' | 'Turnier' | 'Veranstaltung' | 'Vereinsleben';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'Spielbericht',
  'Turnier',
  'Veranstaltung',
  'Vereinsleben',
];

export interface News {
  newsId: number;
  newsDate: Date;
  title: string;
  content: string;
  imageUrl: string | null;
  homeImageUrl: string | null;
  category: NewsCategory | null;
  /** Id of the match a match report is about (MatchInfo.id). */
  matchId: number | null;
}
