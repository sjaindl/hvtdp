export interface NavItem {
  label: string;
  /** Router path. Parametrised pages link to the current season. */
  path: string;
  /** Path prefix used to detect the active item (covers all seasons). */
  match: string;
  icon: string;
  description?: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: 'Home', path: '/home', match: '/home', icon: 'home' },
  { label: 'News', path: '/news', match: '/news', icon: 'article' },
  { label: 'Team', path: '/team', match: '/team', icon: 'groups' },
  {
    label: 'Liga',
    path: '/championship',
    match: '/championship',
    icon: 'leaderboard',
  },
  { label: 'Fotos', path: '/gallery', match: '/gallery', icon: 'photo_library' },
  { label: 'Videos', path: '/social', match: '/social', icon: 'smart_display' },
];

export const HIGHLIGHTS_NAV: NavItem[] = [
  {
    label: 'Tor des Jahres',
    path: '/goaloftheseason',
    match: '/goaloftheseason',
    icon: 'sports_soccer',
    description: 'Die schönsten Treffer der Saison',
  },
  {
    label: 'Spieler des Jahres',
    path: '/playeroftheseason',
    match: '/playeroftheseason',
    icon: 'star',
    description: 'Wer war der Beste der Saison?',
  },
  {
    label: 'Hallenturnier',
    path: '/hallenturnier',
    match: '/hallenturnier',
    icon: 'emoji_events',
    description: 'Unser Turnier im Winter',
  },
  {
    label: 'Adventkalender',
    path: '/advent',
    match: '/advent',
    icon: 'celebration',
    description: '24 Türchen voller Überraschungen',
  },
];

export const CLUB_NAV: NavItem[] = [
  {
    label: 'Über uns',
    path: '/about',
    match: '/about',
    icon: 'info',
    description: 'Geschichte und Vorstand',
  },
  {
    label: 'Mitgliedschaft',
    path: '/membership',
    match: '/membership',
    icon: 'card_membership',
    description: 'Werde Teil des HV TDP',
  },
  {
    label: 'Fanshop',
    path: '/fanshop',
    match: '/fanshop',
    icon: 'shopping_bag',
    description: 'Trikots, Schals und mehr',
  },
  {
    label: 'Spenden',
    path: '/donation',
    match: '/donation',
    icon: 'volunteer_activism',
    description: 'Unterstütze den Verein',
  },
  {
    label: 'Dokumente',
    path: '/documents',
    match: '/documents',
    icon: 'description',
    description: 'Statuten und Formulare',
  },
  {
    label: 'Kontakt',
    path: '/contact',
    match: '/contact',
    icon: 'mail',
    description: 'Schreib uns eine Nachricht',
  },
  {
    label: 'Hall of Papp-Fans',
    path: '/hallofpapp',
    match: '/hallofpapp',
    icon: 'emoji_people',
    description: 'Danke an unsere Tribünen-Fans',
  },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/hvtdpstainz/' },
  { label: 'Instagram', icon: 'photo_camera', href: 'https://www.instagram.com/hvtdpstainz_2014/' },
  // TODO(content): the old footer linked Twitter/X; confirm whether a YouTube channel should be linked instead.
  { label: 'Twitter', icon: 'alternate_email', href: 'https://twitter.com/HvStainz/' },
  { label: 'E-Mail', icon: 'mail', href: 'mailto:hvtdpstainz@gmx.at' },
];

export const PARTNERS = [
  {
    name: 'Udemy',
    href: 'https://www.udemy.com/user/stefan-jaindl/',
    image: 'assets/images/udemy.jpg',
  },
  {
    name: 'Textildruckprofi',
    href: 'http://www.textildruckprofi.com/',
    image: 'assets/images/tdp.jpg',
  },
  { name: 'DAN Graz', href: 'https://dangraz.at/', image: 'assets/images/dan_logo.jpeg' },
];
