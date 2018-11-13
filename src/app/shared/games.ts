export class Link {
    link: string
    description: string
    scorer: string
}

export class Game {
    round: number
    description: string
    date: Date
    links: Link[]
}

export class GameSeason {
    season: string
    games: Game[]
}

export const GAMES : GameSeason[] = [ 
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
                    description: '0:1',
                    scorer: 'Schriebl'
                },
                {
                    link: 'https://www.youtube.com/watch?v=t_UoWMNWYAI&list=UUQDFAfoc1IdUWkQ7U9PpkDg&index=5',
                    description: '0:2',
                    scorer: 'Fabian'
                },
                {
                    link: 'https://www.youtube.com/watch?v=vCzM613FifE&index=4&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:3',
                    scorer: 'Eigentor'
                },
                {
                    link: 'https://www.youtube.com/watch?v=xiRa1e0nBuk&index=3&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:4',
                    scorer: 'Loscher'
                },
                {
                    link: 'https://www.youtube.com/watch?v=WuALrPrlB30&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:5',
                    scorer: 'Loscher'
                },
                {
                    link: 'https://www.youtube.com/watch?v=Z4mz8i3t43s&index=2&list=UUQDFAfoc1IdUWkQ7U9PpkDg',
                    description: '1:6',
                    scorer: 'Primus'
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
                    description: '1:0',
                    scorer: 'Fabian'
                }
            ]
        },
        ]
    },
    {
        season: '2018/2019',
        games: [
            {
                round: 4,
                description: 'HV TDP Stainz - HC Kaindorf/Oberhaag',
                date: new Date('2018-08-08'),
                links: [
                    {
                        link: 'https://www.youtube.com/watch?v=kMli8BjNcUA',
                        description: '4:0',
                        scorer: 'Nöstel'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=yytoIdvp_iU',
                        description: '5:0',
                        scorer: 'Fabian'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=FZzO5SxjCiQ',
                        description: '6:0',
                        scorer: 'Puchleitner'
                    }
                ]
            },
            {
                round: 5,
                description: 'HV TDP Stainz - FC Stainztal',
                date: new Date('2018-09-15'),
                links: [
                    {
                        link: 'https://www.youtube.com/watch?v=Uxr18fztOUk',
                        description: '1:0',
                        scorer: 'Kohlberger'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=zsubG_CHbdI',
                        description: '2:0',
                        scorer: 'Fabian'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=mUfacJJN9BI',
                        description: '3:0',
                        scorer: 'Nöstel'
                    }
                ]
            },

            {
                round: 8,
                description: 'HV TDP Stainz - FC Gasselsdorf',
                date: new Date('2018-10-06'),
                links: [
                    {
                        link: 'https://www.youtube.com/watch?v=KgWlgJenLlQ',
                        description: '1:1',
                        scorer: 'Fabian'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=5hYhHEPCL_U',
                        description: '2:1',
                        scorer: 'Fabian'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=2Zosvzdlzck',
                        description: '3:1',
                        scorer: 'Hilberger'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=OOfm19gFiAA',
                        description: '4:1',
                        scorer: 'Wolf'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=LtjhGeqcHkQ',
                        description: '5:1',
                        scorer: 'Sackl'
                    }
                ]
            },
            {
                round: 9,
                description: 'Aqua Line Groß St. Florian - HV TDP Stainz',
                date: new Date('2018-10-14'),
                links: [
                    {
                        link: 'https://www.youtube.com/watch?v=WZC6WrsusJ4&t=2s',
                        description: '2:1',
                        scorer: 'Fabian'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=0NBD_lLSWxU',
                        description: '3:2',
                        scorer: 'Nöstel'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=2c3b8zGW1yo',
                        description: '3:3',
                        scorer: 'Sincek'
                    }
                ]
            },
            {
                round: 10,
                description: 'HV TDP Stainz - HFC Leutschach',
                date: new Date('2018-10-21'),
                links: [
                    {
                        link: 'https://www.youtube.com/watch?v=iZgXM-9TtvM',
                        description: '1:0',
                        scorer: 'Nöstel'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=kWBI19IvLSo',
                        description: '2:0',
                        scorer: 'Nöstel'
                    },
                    {
                        link: 'https://www.youtube.com/watch?v=pJB-GLHfRdc',
                        description: '3:0',
                        scorer: 'Hilberger'
                    }
                ]
            },
        ]
    }
]
