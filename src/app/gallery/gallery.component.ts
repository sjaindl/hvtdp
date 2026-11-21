import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Album, Photo } from '../shared/photos';
import { Seasons } from '../shared/seasons';
import { DateUtil } from '../shared/utils/date.util';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

const PHOTO_PAGE_SIZE = 24;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  standalone: true,
  imports: [RouterModule, EmptyStateComponent, PageIntroComponent],
})
export class GalleryComponent implements OnInit, OnDestroy {
  readonly seasons = Seasons.gallery;
  readonly imageBaseUrl = baseUrlImages;
  readonly formatDate = DateUtil.formatDate;

  albums: Album[] = [];
  season: string;
  selectedAlbum: Album | null = null;
  loaded = false;
  failed = false;
  errorText = '';

  visiblePhotos = PHOTO_PAGE_SIZE;
  lightboxIndex: number | null = null;
  private touchStartX: number | null = null;

  private routeSub: Subscription;
  private photosSub: Subscription;
  selectedAlbumSlug: string | null = null;

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.selectedAlbumSlug = params['albumId'] ? decodeURIComponent(params['albumId']) : null;
      this.visiblePhotos = PHOTO_PAGE_SIZE;
      this.closeLightbox();
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
    document.body.classList.remove('overflow-hidden');
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

  showMorePhotos() {
    this.visiblePhotos += PHOTO_PAGE_SIZE;
  }

  openLightbox(index: number) {
    this.lightboxIndex = index;
    document.body.classList.add('overflow-hidden');
  }

  closeLightbox() {
    this.lightboxIndex = null;
    document.body.classList.remove('overflow-hidden');
  }

  step(delta: number) {
    if (this.lightboxIndex === null || !this.photos.length) {
      return;
    }
    this.lightboxIndex = (this.lightboxIndex + delta + this.photos.length) % this.photos.length;
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    if (this.touchStartX === null) {
      return;
    }
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(delta) > 50) {
      this.step(delta < 0 ? 1 : -1);
    }
    this.touchStartX = null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.lightboxIndex === null) {
      return;
    }
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.step(1);
    if (event.key === 'ArrowLeft') this.step(-1);
  }

  loadAlbums() {
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
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }
}
