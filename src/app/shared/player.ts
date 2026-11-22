export type PlayerStatus = 'Kader' | 'Aktiv' | 'Ehemalig';

export interface Player {
  firstName: string;
  lastName: string;
  position: string;
  status: PlayerStatus;
  memberSinceYear: number | null;
  imageUrl: string | null;
  games: number;
  goals: number;
  jerseyNumber?: number | null;
}
