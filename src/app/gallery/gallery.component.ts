import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Album, Photo } from '../shared/photos';
import { Seasons } from '../shared/seasons';
import { DateUtil } from '../shared/utils/date.util';
import { ErrorUtil } from '../shared/utils/error.util';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { FittedImageComponent } from '../ui/fitted-image/fitted-image.component';
import { ImageViewerService, ViewerImage } from '../ui/image-viewer/image-viewer.service';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';

const PHOTO_PAGE_SIZE = 24;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  standalone: true,
  imports: [
    RouterModule,
    EmptyStateComponent,
    FittedImageComponent,
    PageIntroComponent,
    SlidingIndicatorDirective,
    ContentSwapDirective,
  ],
})
export class GalleryComponent implements OnInit, OnDestroy {
  private mysqlService = inject(MysqlService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private imageViewer = inject(ImageViewerService);

  readonly seasons = Seasons.gallery;
  readonly imageBaseUrl = baseUrlImages;
  readonly formatDate = DateUtil.formatDate;

  albums: Album[] = [];
  season = '';
  selectedAlbum: Album | null = null;
  loaded = false;
  failed = false;
  loading = false;
  /** Season of the content on screen; changing it plays the content entrance animation. */
  contentKey = '';
  errorText = '';

  visiblePhotos = PHOTO_PAGE_SIZE;
  private photoRatios: Record<string, number> = {};

  private routeSub?: Subscription;
  private photosSub?: Subscription;
  selectedAlbumSlug: string | null = null;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.selectedAlbumSlug = params['albumId'] ? decodeURIComponent(params['albumId']) : null;
      this.visiblePhotos = PHOTO_PAGE_SIZE;
      this.loadAlbums();
    });

    this.titleService.setTitle('HV TDP Stainz: Galerie');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Die wichtigsten Events des HV TDP Stainz in der Galerie.',
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.photosSub?.unsubscribe();
  }

  albumSlug(album: Album): string {
    const slug = (album.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'album';
  }

  cover(album: Album): string | null {
    return album.photos?.length ? this.imageBaseUrl + album.photos[0].imagePath : null;
  }

  get photos(): Photo[] {
    return this.selectedAlbum?.photos ?? [];
  }

  /** Width/height of a photo, known once it has loaded (square until then). */
  ratio(photo: Photo): number {
    return this.photoRatios[photo.imagePath] ?? 1;
  }

  onPhotoLoad(photo: Photo, event: Event) {
    const image = event.target as HTMLImageElement;
    if (image.naturalWidth && image.naturalHeight) {
      this.photoRatios[photo.imagePath] =
        Math.round((image.naturalWidth / image.naturalHeight) * 1000) / 1000;
    }
  }

  showMorePhotos() {
    this.visiblePhotos += PHOTO_PAGE_SIZE;
  }

  /** Opens the photo in the fullscreen viewer, browsable through the whole album. */
  openPhoto(index: number) {
    const album = this.selectedAlbum?.name ?? '';
    const images: ViewerImage[] = this.photos.map((photo) => ({
      src: this.imageBaseUrl + photo.imagePath,
      alt: photo.description || album,
    }));
    this.imageViewer.open(images, index);
  }

  loadAlbums() {
    this.loading = true;
    this.failed = false;
    this.photosSub?.unsubscribe();
    this.photosSub = this.mysqlService.getPhotos().subscribe({
      next: (albums) => {
        this.albums = albums.filter((album) => album.season == this.season);
        this.selectedAlbum = this.selectedAlbumSlug
          ? (this.albums.find((album) => this.albumSlug(album) === this.selectedAlbumSlug) ?? null)
          : null;
        if (this.selectedAlbum) {
          this.titleService.setTitle(`HV TDP Stainz: ${this.selectedAlbum.name}`);
        }
        this.loaded = true;
        this.loading = false;
        this.contentKey = this.season;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.loading = false;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }
}
