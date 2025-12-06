import { Component, OnInit, HostListener } from '@angular/core';
import { Item } from '../shared/items';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-fanshop',
  templateUrl: './fanshop.component.html',
  styleUrls: ['./fanshop.component.css'],
})
export class FanshopComponent implements OnInit {
  items: Item[];
  imageBaseUrl: String;

  gridImageHeight = null;
  gridColumns = null;
  titleSizeEm = 2.0;
  priceSizeEm = 1.5;
  detailSizeEm = 1.0;

  isMobile = null;

  constructor(
    private deviceService: DeviceDetectorService,
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages;

    /*
    this.deviceInfo = this.deviceService.getDeviceInfo();

    device info holds the following properties:
    browser
    os
    device (mobile/table/desktop)
    userAgent
    os_version
    */
    this.checkDevice();
    this.isMobile || window.innerWidth < 641 ? this.setMobile() : this.setDesktop();

    this.mysqlService.getItems().subscribe((items) => {
      this.items = items;
    });

    this.titleService.setTitle('HV TDP Stainz: Fanshop');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Handtücher, Fan-Shirts, Mützen & Co aus dem offizellen Fanshop des HV TDP Stainz.',
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

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice();
    event.target.innerWidth < 641 ? this.setMobile() : this.setDesktop();
  }

  setMobile() {
    this.setAttributes(1, 250, 1.4, 1.0, 0.85);
  }

  setDesktop() {
    this.setAttributes(2, 400, 2.0, 1.5, 1.0);
  }

  setAttributes(gridColumns, gridImageHeight, titleSizeEm, priceSizeEm, detailSizeEm) {
    this.gridColumns = gridColumns;
    this.gridImageHeight = gridImageHeight;
    this.titleSizeEm = titleSizeEm;
    this.priceSizeEm = priceSizeEm;
    this.detailSizeEm = detailSizeEm;
  }
}
