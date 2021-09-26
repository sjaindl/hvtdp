export class Link {
    link: string
    description: string
    scorer: string
}

export class Game {
    round: number
    description: string
    date: string
    links: Link[]
    customText: string
}

export class GameSeason {
    season: string
    games: Game[]
}
