/** A championship season from Strapi. */
export interface Season {
  /** URL key, e.g. "2026-2027". */
  key: string;
  league: string;
  /** Note shown above the table. */
  preface: string;
  /** Note shown below the results. */
  postResults: string;
}
