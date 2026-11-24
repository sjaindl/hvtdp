export interface Album {
  name: string;
  /** Part of the album link: /gallery/<year>/<slug>. */
  slug: string;
  year: string;
  /** "2026-08-22" */
  date: string | null;
  coverUrl: string | null;
  photoCount: number;
}

export interface Photo {
  /** Size for the album grid. */
  url: string;
  /** Size for the fullscreen viewer. */
  fullUrl: string;
  /** Width / height; known before the image loads. */
  ratio: number;
  /** Description of the photo (e.g. "1. Platz: FC Bazinga"), else null. */
  caption: string | null;
}

export interface AlbumWithPhotos extends Album {
  photos: Photo[];
}
