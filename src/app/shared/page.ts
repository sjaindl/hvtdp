/** The Hallenturnier page, prepared for display. */
export interface Hallenturnier {
  title: string;
  lead: string;
  imageUrl: string | null;
  /** "Di, 05.01.2027", or '' without a deadline. */
  deadline: string;
  facts: { icon: string; label: string; value: string; hint: string }[];
  prizes: string[];
  bank: { recipient: string; iban: string; reference: string };
  /** Photos of last year's tournament. */
  lastEdition: { link: string[]; title: string } | null;
  /** Switched on and the deadline has not passed. */
  registrationOpen: boolean;
}

export interface HallenturnierRegistration {
  name: string;
  email: string;
  teamName: string;
  /** Honeypot: hidden field that only bots fill in. */
  website: string;
}

export interface AdventDoor {
  day: number;
  posterUrl: string;
  videoUrl: string;
}

export interface AdventCalendar {
  year: string;
  title: string;
  lead: string;
  note: string;
  doors: AdventDoor[];
}

/** The Torschuss Challenge (Golden Shot) page, prepared for display. */
export interface GoldenShotPage {
  active: boolean;
  title: string;
  sponsor: string;
  imageUrl: string | null;
  /** Markdown (prizes, rules). */
  description: string;
  /** "Sa, 06.06.2026", or ''. */
  finalDate: string;
  /** Switched on and the deadline has not passed. */
  registrationOpen: boolean;
  deadline: string;
  /** The voting of this edition. */
  poll: { year: string; open: boolean; closesAt: string } | null;
  resultImageUrl: string | null;
}
