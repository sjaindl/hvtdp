import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { News } from '../shared/news';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { MysqlService } from '../services/mysql.service';
import { Ticker } from '../shared/ticker';
import { Title, Meta } from '@angular/platform-browser';

import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Image } from '../shared/image';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tickerItems: Ticker[] = [];
  isMobile = null;

  news: News[];

  carouselItems$: Observable<Image[]>;

  constructor(
    private deviceService: DeviceDetectorService,
    private ccService: NgcCookieConsentService,
    private mysqlService: MysqlService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private metaTagService: Meta
  ) {
    this.mysqlService.getNews().subscribe((news) => {
      this.news = news;

      this.carouselItems$ = this.mysqlService.getNews().pipe(
        map((news) => {
          return news.map((newsItem) => {
            return {
              imagePath:
                newsItem.imagePathHome !== '' ? newsItem.imagePathHome : newsItem.imagePath,
              navPath: '/news/' + newsItem.newsId,
              title: newsItem.title,
              date: newsItem.newsDate,
            };
          });
        }),
        tap(console.info)
      );
    });

    this.mysqlService.getTickerItems().subscribe((tickerItems) => {
      this.tickerItems = tickerItems;
    });
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

    this.checkDevice();

    this.titleService.setTitle('Fußballverein Stainz. HVTDP Stainz.');
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Auf der Website finden sich die aktuellen News rund um den HV TDP Stainz, den Stand in der Meisterschaft, unser Team, die Galerie, Videos und andere Highlights wie den offiziellen HV TDP Fanshop. Unter den Matchballspenden finden sich außerdem unsere Sponsoren. Auch aktuelle Umfragen und Dokumente rund um das HV TDP Vereinsleben werden zur Verfügung gestellt.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);

    // // subscribe to cookieconsent observables to react to main events
    // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
    //   () => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //   })

    // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
    //   () => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //   })

    // this.initializeSubscription = this.ccService.initialize$.subscribe(
    //   (event: NgcInitializeEvent) => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //   })

    // this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
    //   (event: NgcStatusChangeEvent) => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //   })

    // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
    //   () => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //   })

    //   this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
    //   (event: NgcNoCookieLawEvent) => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //   })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    // this.popupOpenSubscription.unsubscribe()
    // this.popupCloseSubscription.unsubscribe()
    // this.initializeSubscription.unsubscribe()
    // this.statusChangeSubscription.unsubscribe()
    // this.revokeChoiceSubscription.unsubscribe()
    // this.noCookieLawSubscription.unsubscribe()
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice();
  }
}
