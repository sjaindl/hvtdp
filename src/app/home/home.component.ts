import { Component, OnInit, HostListener } from '@angular/core';
import { News } from '../shared/news';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { Ticker } from '../shared/ticker';
import { Router } from '@angular/router';

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
  
  constructor(private deviceService: DeviceDetectorService, private mysqlService: MysqlService, public router: Router) { 
    this.mysqlService.getNews().subscribe( news => {
      this.items = news
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
