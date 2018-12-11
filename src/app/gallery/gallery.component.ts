import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { AlbumSeason, Album, Photo } from '../shared/photos';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  isMobile = null

  @ViewChild('myCarousel') myCarousel: NguCarousel<any>;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: false,
    touch: true,
    velocity: 0.2
  }

  carouselItems: Photo[]
  
  constructor(private mysqlService: MysqlService, private cdr: ChangeDetectorRef, private deviceService: DeviceDetectorService) { 
  }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages
    this.checkDevice()

    this.mysqlService.getPhotos().subscribe(seasons => {
      this.seasons = seasons
    })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice()
  }

  selectSeason(season: AlbumSeason) {
    this.selectedSeason = season
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile()
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
