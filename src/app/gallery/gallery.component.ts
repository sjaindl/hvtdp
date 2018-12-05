import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AlbumSeason, Album, Photo } from '../shared/photos';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  seasons: AlbumSeason[]
  selectedSeason: AlbumSeason = null
  selectedAlbum: Album = null
  imageBaseUrl: String

  @ViewChild('myCarousel') myCarousel: NguCarousel<any>;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: true,
    touch: true,
    velocity: 0.2
  }

  carouselItems: Photo[]
  
  constructor(private mysqlService: MysqlService, private cdr: ChangeDetectorRef) { 
  }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getPhotos().subscribe(seasons => {
      this.seasons = seasons
    })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  selectSeason(season: AlbumSeason) {
    this.selectedSeason = season
  }

  selectAlbum(album: Album) {
    this.selectedAlbum = album
    this.carouselItems = album.photos
  } 

  backFromPhotos() {
    this.selectedAlbum = null
  }

  backFromAlbums() {
    this.selectedSeason = null
  }

}
