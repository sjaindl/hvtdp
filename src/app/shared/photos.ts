export class Photo {
    description: string
    imagePath: string
}

export class Album {
    season: string
    name: string
    date: Date
    photos: Photo[]
}
