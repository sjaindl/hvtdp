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
        albums: [
            {
                name: 'Meisterfeier',
                date: new Date('2018-07-14'),
                photos: [
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/001.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/003.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/004.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/006.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/007.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/008.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/010.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/011.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/013.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/014.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/015.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/017.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/019.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/020.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/021.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/023.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/024.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/025.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/026.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/027.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/028.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/029.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/030.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/031.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/032.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/033.jpg'
                    },
                    {
                        description: '',
                        imagePath: '../../assets/images/gallery/meisterfeier_2018/035.jpg'
                    }
                ]
                }
        ]
    }
]
