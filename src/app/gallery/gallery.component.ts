import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImagesliderComponent } from '../imageslider/imageslider.component';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Album } from '../shared/photos';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [CommonModule, ImagesliderComponent],
})
export class GalleryComponent implements OnInit, OnDestroy {
  albums: Album[] = [];
  season: String;
  imageBaseUrl: String;
  isMobile = null;
  selectedAlbum: Album | null = null;

  private routeSub: Subscription;
  private photosSub: Subscription;
  private selectedAlbumSlug: String | null = null;

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta,
    private router: Router
  ) {}

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages;

    this.routeSub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.selectedAlbumSlug = params['albumId'] ? decodeURIComponent(params['albumId']) : null;
      this.loadAlbums();
    });

    this.titleService.setTitle('HV TDP Stainz: Galerie');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Die wichtigsten Events des HV TDP Stainz in der Galerie.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);
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

  openAlbum(album: Album) {
    this.router.navigate(['/gallery', this.season, this.albumSlug(album)]);
  }

  backToOverview() {
    this.router.navigate(['/gallery', this.season]);
  }

  items(album: Album) {
    if (!album?.photos) {
      return [];
    }
    return album.photos.map((photo) => {
      return {
        imagePath: photo.imagePath,
        navPath: '',
        title: photo.description,
        date: undefined,
      };
    });
  }

  private loadAlbums() {
    this.photosSub?.unsubscribe();
    this.photosSub = this.mysqlService.getPhotos().subscribe((albums) => {
      this.albums = albums.filter((album) => album.season == this.season);
      this.selectedAlbum =
        this.selectedAlbumSlug && this.albums.length
          ? this.albums.find((album) => this.albumSlug(album) === this.selectedAlbumSlug) || null
          : null;
    });
  }
}
