import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { News } from '../shared/news';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { Ticker } from '../shared/ticker';
import { Router } from '@angular/router';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

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
  carouselWidth = null
  imageWidth = null
  imageHeight = null

  name = 'Angular';
  slideNo = 0;
  withAnim = true;
  resetAnim = true;

  @ViewChild('myCarousel') myCarousel: NguCarousel<any>;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: true,
    touch: true,
    velocity: 0.2
  }
  carouselItems: News[]

  constructor(private deviceService: DeviceDetectorService, private mysqlService: MysqlService, public router: Router, private cdr: ChangeDetectorRef) { 
    this.mysqlService.getNews().subscribe( news => {
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
    this.isMobile || window.innerWidth < 641 ? this.setMobile() : this.setDesktop()
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  reset() {
    this.myCarousel.reset(!this.resetAnim);
  }

  moveTo(slide) {
    this.myCarousel.moveTo(slide, !this.withAnim);
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice()
    event.target.innerWidth < 641 ? this.setMobile() : this.setDesktop()
  }

  setMobile() {
    this.setAttributes(280, 280, 196)
  }

  setDesktop() {
    this.setAttributes(700, 700, 490)
  }

  setAttributes(carouselWidth, imageWidth, imageHeight) {
    this.carouselWidth = carouselWidth
    this.imageWidth = imageWidth
    this.imageHeight = imageHeight
  }

  showImageDetails(item) {
    console.log('navigate to ' + '/news/' + item.newsId)
    this.router.navigate(['/news', item.newsId]);
  }
}
