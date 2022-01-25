import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { Albums, Album, Photo } from '../shared/photos'
import { MysqlService } from '../services/mysql.service'
import { baseUrlImages } from '../shared/baseurls'
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  albums: Albums[]
  selectedAlbum: Album = null
  imageBaseUrl: String
  isMobile = null

  @ViewChild('myCarousel') myCarousel: NguCarousel<any>
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: false,
    touch: true,
    velocity: 0.2
  }

  carouselItems: Photo[]
  
  constructor(private mysqlService: MysqlService, private cdr: ChangeDetectorRef, private deviceService: DeviceDetectorService, private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages
    this.checkDevice()

    this.mysqlService.getPhotos().subscribe(albums => {
      this.albums = albums
    })

    this.titleService.setTitle("HV TDP Stainz: Galerie")
    this.metaTagService.updateTag({
      name: 'description', content: "Die wichtigsten Events des HV TDP Stainz in der Galerie."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  ngAfterViewInit() {
    this.cdr.detectChanges()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice()
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
}
