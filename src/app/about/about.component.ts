import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { HvtdpImageComponent } from '../hvtdp-image/hvtdp-image.component';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Chef } from '../shared/chefs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: [CommonModule, HvtdpImageComponent],
})
export class AboutComponent implements OnInit {
  obmaenner: Chef[];
  kassierer: Chef[];
  schriftfuehrer: Chef[];
  rechnungspruefer: Chef[];

  obmaennerWithoutDummy: Chef[];
  kassiererWithoutDummy: Chef[];
  schriftfuehrerWithoutDummy: Chef[];
  rechnungsprueferWithoutDummy: Chef[];

  imageBaseUrl: String;

  isMobile = null;

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.checkDevice();
    this.imageBaseUrl = baseUrlImages;

    this.mysqlService.getChefs().subscribe((chefs: Chef[]) => {
      this.obmaenner = chefs.filter((chef) => {
        return chef.function.includes('Obmann');
      });

      this.kassierer = chefs.filter((chef) => {
        return chef.function.includes('Kassier');
      });

      this.schriftfuehrer = chefs.filter((chef) => {
        return chef.function.includes('Schriftführer');
      });

      this.rechnungspruefer = chefs.filter((chef) => {
        return chef.function.includes('Rechnungsprüfer');
      });

      this.obmaennerWithoutDummy = chefs.filter((chef) => {
        return chef.function.includes('Obmann') && chef.firstName != 'Dummy';
      });

      this.kassiererWithoutDummy = chefs.filter((chef) => {
        return chef.function.includes('Kassier') && chef.firstName != 'Dummy';
      });

      this.schriftfuehrerWithoutDummy = chefs.filter((chef) => {
        return chef.function.includes('Schriftführer') && chef.firstName != 'Dummy';
      });

      this.rechnungsprueferWithoutDummy = chefs.filter((chef) => {
        return chef.function.includes('Rechnungsprüfer') && chef.firstName != 'Dummy';
      });
    });

    this.titleService.setTitle('HV TDP Stainz: Über uns');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Informationen über den HV TDP Stainz',
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
}
