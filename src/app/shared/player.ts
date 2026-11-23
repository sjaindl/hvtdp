/** Squad status of a player (field `squad` in Strapi). */
export type PlayerStatus = 'Kader' | 'Aktiv' | 'Ehemalig';

export interface Player {
  firstName: string;
  lastName: string;
  position: string;
  squad: PlayerStatus;
  memberSinceYear: number | null;
  imageUrl: string | null;
  games: number;
  goals: number;
}
