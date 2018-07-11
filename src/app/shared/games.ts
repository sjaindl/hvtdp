export class Link {
    link: string
    description: string
}

export class Game {
    round: number
    description: string
    date: Date
    links: Link[]
}

export class Season {
    season: string
    games: Game[]
}

export const SEASONS : Season[] = [ 
    {
        season: '2017/2018',
        games: [
            {
            round: 13,
            description: 'HFC Schilcher : HV TDP Stainz',
            date: new Date('2018-06-14'),
            links: [
                {
                    link: 'https://www.youtube.com/watch?v=7WiLVl1NSmY&list=UUQDFAfoc1IdUWkQ7U9PpkDg&index=6',
                    description: '0:1 Schriebl'
                },
                {
                    link: 'https://www.youtube.com/watch?v=t_UoWMNWYAI&list=UUQDFAfoc1IdUWkQ7U9PpkDg&index=5',
                    description: '0:2 Fabian'
                },
                {
                    link: 'https://www.youtube.com/watch?v=vCzM613FifE&index=4&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:3 Eigentor'
                },
                {
                    link: 'https://www.youtube.com/watch?v=xiRa1e0nBuk&index=3&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:4 Loscher'
                },
                {
                    link: 'https://www.youtube.com/watch?v=WuALrPrlB30&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:5 Loscher'
                },
                {
                    link: 'https://www.youtube.com/watch?v=Z4mz8i3t43s&index=2&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:6 Primus'
                }
            ]
        },
        {
            round: 5,
            description: 'FC Holzhacker : HV TDP Stainz',
            date: new Date('2017-10-19'),
            links: [
                {
                    link: 'https://www.youtube.com/watch?v=OXtyINGEJSE&index=48&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:0 Fabian'
                }
            ]
        },
        ]
    }   
]

