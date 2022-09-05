import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { Album, Photo } from '../shared/photos'
import { MysqlService } from '../services/mysql.service'
import { baseUrlImages } from '../shared/baseurls'
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Title, Meta } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  albums: Album[]
  season: string
  selectedAlbum: Album = null
  imageBaseUrl: String
  isMobile = null

  private sub: any

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
  
  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    private metaTagService: Meta
    ) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages
    this.checkDevice()

    this.sub = this.route.params.subscribe(params => {
      this.season = params['season']
      this.mysqlService.getPhotos().subscribe(albums => {
        this.albums = albums.filter((album) => {
          return album.season == this.season
        })
      })
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

  ngOnDestroy() {
    this.sub.unsubscribe()
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
