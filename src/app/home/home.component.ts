import { Component, OnInit, HostListener } from '@angular/core';
import { NEWS, News } from '../shared/news';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  items: Array<any> = []
  isMobile = null
  carouselWidth = null
  imageWidth = null
  imageHeight = null
  
  constructor(private deviceService: DeviceDetectorService) { 
    this.items = NEWS
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
}
