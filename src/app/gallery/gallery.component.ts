import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, switchMap } from 'rxjs';
import { GalleryService } from '../services/gallery.service';
import { Album, AlbumWithPhotos, Photo } from '../shared/photos';
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
  private galleryService = inject(GalleryService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private imageViewer = inject(ImageViewerService);

  readonly formatDate = DateUtil.formatDate;

  /** Years with albums, newest first (season chips). */
  seasons: string[] = [];
  albums: Album[] = [];
  season = '';
  selectedAlbum: AlbumWithPhotos | null = null;
  selectedAlbumSlug: string | null = null;
  loaded = false;
  failed = false;
  loading = false;
  /** Season of the content on screen; changing it plays the content entrance animation. */
  contentKey = '';
  errorText = '';

  visiblePhotos = PHOTO_PAGE_SIZE;

  private sub?: Subscription;

  ngOnInit() {
    this.loadAlbums();

    this.titleService.setTitle('HV TDP Stainz: Galerie');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Die wichtigsten Events des HV TDP Stainz in der Galerie.',
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get photos(): Photo[] {
    return this.selectedAlbum?.photos ?? [];
  }

  showMorePhotos() {
    this.visiblePhotos += PHOTO_PAGE_SIZE;
  }

  /** Opens the photo in the fullscreen viewer, browsable through the whole album. */
  openPhoto(index: number) {
    const album = this.selectedAlbum?.name ?? '';
    const images: ViewerImage[] = this.photos.map((photo) => ({
      src: photo.fullUrl,
      alt: photo.caption || album,
      caption: photo.caption ?? undefined,
    }));
    this.imageViewer.open(images, index);
  }

  loadAlbums() {
    this.sub?.unsubscribe();
    this.loading = true;
    this.failed = false;
    // Without a year in the URL (/gallery) the newest year is shown.
    this.sub = combineLatest([this.route.params, this.galleryService.getYears()])
      .pipe(
        switchMap(([params, years]): Observable<Album[] | AlbumWithPhotos | null> => {
          this.seasons = years;
          this.season = params['season'] ?? years[0] ?? '';
          this.selectedAlbumSlug = params['albumId'] ? decodeURIComponent(params['albumId']) : null;
          this.visiblePhotos = PHOTO_PAGE_SIZE;
          this.loading = true;
          return this.selectedAlbumSlug
            ? this.galleryService.getAlbum(this.season, this.selectedAlbumSlug)
            : this.galleryService.getAlbums(this.season);
        })
      )
      .subscribe({
        next: (result) => {
          if (Array.isArray(result)) {
            this.albums = result;
            this.selectedAlbum = null;
          } else {
            this.selectedAlbum = result;
            if (result) {
              this.titleService.setTitle(`HV TDP Stainz: ${result.name}`);
            }
          }
          this.loaded = true;
          this.loading = false;
          this.contentKey = this.selectedAlbumSlug ?? this.season;
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
