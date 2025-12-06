import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Album } from '../shared/photos';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css'],
    standalone: false
})
export class GalleryComponent implements OnInit {
  albums: Album[];
  season: string;
  imageBaseUrl: String;
  isMobile = null;

  private sub: any;

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages;

    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.mysqlService.getPhotos().subscribe((albums) => {
        this.albums = albums.filter((album) => {
          return album.season == this.season;
        });
      });
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
    this.sub.unsubscribe();
  }

  items(album: Album) {
    return album.photos.map((photo) => {
      return {
        imagePath: photo.imagePath,
        navPath: '',
        title: photo.description,
        date: undefined,
      };
    });
  }
}
