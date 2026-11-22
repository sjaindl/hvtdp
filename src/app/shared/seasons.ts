/**
 * Season lists used for season chips and navigation, newest first (championship, video, voting and gallery seasons come from Strapi).
 * TODO(API): derive the advent seasons from the API instead of maintaining them here.
 */
export const Seasons = {
  advent: ['2023', '2021'],
};

export const CurrentSeason = {
  advent: Seasons.advent[0],
};

/** "2026-2027" -> "2026/27" */
export function formatSeason(season: string): string {
  const match = (season ?? '').match(/^(\d{4})-\d{2}(\d{2})$/);
  return match ? `${match[1]}/${match[2]}` : season;
}

export const STARTING_ELEVEN_URL = 'https://starting-eleven-2019.firebaseapp.com/home';
export const CLUB_EMAIL = 'hvtdpstainz@gmx.at';
