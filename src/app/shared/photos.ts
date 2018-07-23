export class Photo {
    description: string
    imagePath: string
}

export class Album {
    name: string
    date: Date
    photos: Photo[]
}

export class AlbumSeason {
    season: string
    albums: Album[]
}

export const PHOTOS : AlbumSeason[] = [ 
    {
        season: '2015/2016',
        albums: [
            {
            name: 'Meisterfeier',
            date: new Date('2015-07-14'),
            photos: [
                {
                    description: 'Unser Grillmeister Jimmi Hilli 0,0 Promilli',
                    imagePath: '../../assets/images/gallery/meisterfeier/1.jpg'
                },
                {
                    description: '',
                    imagePath: '../../assets/images/gallery/meisterfeier/2.jpg'
                },
                {
                    description: '',
                    imagePath: '../../assets/images/gallery/meisterfeier/3.jpg'
                }
            ]
            }
        ]
    },
    {
        season: '2016/2017',
        albums: []
    },
    {
        season: '2017/2018',
        albums: []
    }
]
