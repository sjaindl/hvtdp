export class Link {
  link: string;
  description: string;
  scorer: string;
  goalOfSeasonCandidate: number;
}

export class Game {
  season: string;
  round: number;
  description: string;
  date: string;
  links: Link[];
  customText: string;
  homeScore: number | null;
  awayScore: number | null;
}

export class GameLinkFlat {
  season: string;
  round: number;
  description: string;
  date: string;
  link: Link;
  customText: string;
  homeScore: number | null;
  awayScore: number | null;

  constructor(
    season: string,
    round: number,
    description: string,
    date: string,
    link: Link,
    customText: string
  ) {
    this.season = season;
    this.round = round;
    this.description = description;
    this.date = date;
    this.link = link;
    this.customText = customText;
    this.homeScore = null;
    this.awayScore = null;
  }
}
