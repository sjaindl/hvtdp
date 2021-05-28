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
