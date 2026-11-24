/** "2026-2027" -> "2026/27" */
export function formatSeason(season: string): string {
  const match = (season ?? '').match(/^(\d{4})-\d{2}(\d{2})$/);
  return match ? `${match[1]}/${match[2]}` : season;
}

export const STARTING_ELEVEN_URL = 'https://starting-eleven-2019.firebaseapp.com/home';
export const CLUB_EMAIL = 'hvtdpstainz@gmx.at';
