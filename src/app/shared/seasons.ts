/**
 * Season lists used for season chips and navigation, newest first.
 * TODO(API): derive available seasons from the API (games, photos, votings) instead of maintaining them here.
 */
export const Seasons = {
  championship: ['2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022'],
  gallery: ['2026', '2025', '2024', '2023', '2022', '2021', '2019', '2018', '2015'],
  videos: [
    '2026-2027',
    '2025-2026',
    '2024-2025',
    '2023-2024',
    '2022-2023',
    '2021-2022',
    '2018-2019',
    '2017-2018',
  ],
  goalOfTheSeason: ['2026', '2025', '2024', '2023', '2022'],
  playerOfTheSeason: ['2026', '2025', '2024'],
  advent: ['2023', '2021'],
};

export const CurrentSeason = {
  championship: Seasons.championship[0],
  gallery: Seasons.gallery[0],
  videos: Seasons.videos[0],
  goalOfTheSeason: Seasons.goalOfTheSeason[0],
  playerOfTheSeason: Seasons.playerOfTheSeason[0],
  advent: Seasons.advent[0],
};

/** "2026-2027" -> "2026/27" */
export function formatSeason(season: string): string {
  const match = (season ?? '').match(/^(\d{4})-\d{2}(\d{2})$/);
  return match ? `${match[1]}/${match[2]}` : season;
}

export const STARTING_ELEVEN_URL = 'https://starting-eleven-2019.firebaseapp.com/home';
export const CLUB_EMAIL = 'hvtdpstainz@gmx.at';
