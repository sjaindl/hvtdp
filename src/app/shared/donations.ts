export interface Donation {
  donator: string;
  /** ISO date ("2024-06-18"). */
  date: string;
  game: string;
  description: string;
  imageUrl: string | null;
  matchBallImageUrl: string | null;
}
