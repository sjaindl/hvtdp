/** A row of a season's scorer table. */
export interface Scorer {
  name: string;
  goals: number;
  /** Portrait of the linked player (null e.g. for "Eigentor"). */
  imageUrl: string | null;
}
