export class Link {
    link: string
    description: string
    scorer: string
}

export class Game {
    season: string
    round: number
    description: string
    date: string
    links: Link[]
    customText: string
}

export class Games {
    games: Game[]
}
