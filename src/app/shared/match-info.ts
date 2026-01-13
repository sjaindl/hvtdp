export class MatchInfo {
  id: number;
  season: string;
  matchInfo: string;
  dateTime: string | null;
  venue: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  additionalInfo: string | null;
}
