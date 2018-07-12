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
                    description: 'Hilli 0,000 Promilli',
                    imagePath: '../../assets/images/gallery/meisterfeier/1.jpg'
                },
                {
                    description: 'Party!',
                    imagePath: '../../assets/images/gallery/meisterfeier/2.jpg'
                },
                {
                    description: 'Grillerei',
                    imagePath: '../../assets/images/gallery/meisterfeier/3.jpg'
                }
            ]
            }
        ]
    }   
]
