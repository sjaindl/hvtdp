import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Album, AlbumWithPhotos, Photo } from '../shared/photos';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { CmsService } from './cms.service';

interface StrapiAlbum {
  name: string;
  slug: string | null;
  year: string;
  date: string | null;
  cover: StrapiMedia | null;
  /** Only ids in the overview (for the count), full media in the album view. */
  photos: StrapiMedia[] | null;
}

const toAlbum = (album: StrapiAlbum): Album => ({
  name: album.name,
  slug: album.slug ?? '',
  year: album.year,
  date: album.date,
  coverUrl: mediaUrl(album.cover, 'small'),
  photoCount: album.photos?.length ?? 0,
});

const toPhoto =
  (albumName: string) =>
  (photo: StrapiMedia): Photo => ({
    url: mediaUrl(photo, 'medium') ?? '',
    fullUrl: mediaUrl(photo, 'large') ?? '',
    ratio: photo.width && photo.height ? Math.round((photo.width / photo.height) * 1000) / 1000 : 1,
    // The migration stored the album name as caption of photos without a description.
    caption: photo.caption && photo.caption !== albumName ? photo.caption : null,
  });

/** Photo albums from Strapi. */
@Injectable({ providedIn: 'root' })
export class GalleryService {
  private cms = inject(CmsService);

  /** Years with albums, newest first. */
  getYears(): Observable<string[]> {
    return this.cms
      .getCollection<Pick<StrapiAlbum, 'year'>>('albums', { 'fields[0]': 'year' })
      .pipe(map((albums) => [...new Set(albums.map((album) => album.year))].sort().reverse()));
  }

  /** Albums of a year, newest first, with cover and photo count (without the photos). */
  getAlbums(year: string): Observable<Album[]> {
    return this.cms
      .getCollection<StrapiAlbum>('albums', {
        'filters[year][$eq]': year,
        'sort[0]': 'date:desc',
        'populate[cover]': true,
        'populate[photos][fields][0]': 'id',
      })
      .pipe(map((albums) => albums.map(toAlbum)));
  }

  /** One album with its photos, or null if there is none with this slug in the year. */
  getAlbum(year: string, slug: string): Observable<AlbumWithPhotos | null> {
    return this.cms
      .getCollection<StrapiAlbum>('albums', {
        'filters[year][$eq]': year,
        'filters[slug][$eq]': slug,
        'populate[cover]': true,
        'populate[photos]': true,
      })
      .pipe(
        map(([album]) =>
          album
            ? { ...toAlbum(album), photos: (album.photos ?? []).map(toPhoto(album.name)) }
            : null
        )
      );
  }
}
