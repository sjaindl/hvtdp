/**
 * Season lists used for season chips and navigation, newest first (championship, video and voting seasons come from Strapi).
 * TODO(API): derive available seasons from the API (photos, advent) instead of maintaining them here.
 */
export const Seasons = {
  gallery: ['2026', '2025', '2024', '2023', '2022', '2021', '2019', '2018', '2015'],
  advent: ['2023', '2021'],
};

export const CurrentSeason = {
  gallery: Seasons.gallery[0],
  advent: Seasons.advent[0],
};

/** "2026-2027" -> "2026/27" */
export function formatSeason(season: string): string {
  const match = (season ?? '').match(/^(\d{4})-\d{2}(\d{2})$/);
  return match ? `${match[1]}/${match[2]}` : season;
}

export const STARTING_ELEVEN_URL = 'https://starting-eleven-2019.firebaseapp.com/home';
export const CLUB_EMAIL = 'hvtdpstainz@gmx.at';
