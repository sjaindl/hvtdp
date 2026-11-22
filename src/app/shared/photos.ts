export interface Photo {
  description: string;
  imagePath: string;
}

export interface Album {
  season: string;
  name: string;
  date: Date;
  photos: Photo[];
}
