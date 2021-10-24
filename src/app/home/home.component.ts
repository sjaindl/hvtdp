import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { News } from '../shared/news';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { Ticker } from '../shared/ticker';
import { Router } from '@angular/router';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  imageBaseUrl: String
  items: Array<any> = []
  tickerItems: Ticker[] = []
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
  carouselItems: News[]

  constructor(private deviceService: DeviceDetectorService, private mysqlService: MysqlService, public router: Router, private cdr: ChangeDetectorRef, private titleService: Title, private metaTagService: Meta) { 
    this.mysqlService.getNews().subscribe(news => {
      this.items = news
      this.carouselItems = news
    })

    this.mysqlService.getTickerItems().subscribe( tickerItems => {
      this.tickerItems = tickerItems
    })
  }
  
  ngOnInit() {
    /*
    this.deviceInfo = this.deviceService.getDeviceInfo();

    device info holds the following properties:
    browser
    os
    device (mobile/table/desktop)
    userAgent
    os_version
    */
    this.imageBaseUrl = baseUrlImages
    this.checkDevice()

    this.titleService.setTitle("Fußballverein Stainz. HVTDP Stainz.")
    this.metaTagService.updateTag({
      name: 'description', content: "Auf der Website finden sich die aktuellen News rund um den HV TDP Stainz, den Stand in der Meisterschaft, unser Team, die Galerie, Videos und andere Highlights wie den offiziellen HV TDP Fanshop. Unter den Matchballspenden finden sich außerdem unsere Sponsoren. Auch aktuelle Umfragen und Dokumente rund um das HV TDP Vereinsleben werden zur Verfügung gestellt."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice()
  }

  showImageDetails(item) {
    console.log('navigate to ' + '/news/' + item.newsId)
    this.router.navigate(['/news', item.newsId]);
  }
}
