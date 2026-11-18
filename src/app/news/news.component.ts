import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Marked } from 'marked';
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
import { HvtdpImageComponent } from '../hvtdp-image/hvtdp-image.component';
import { CmsService } from '../services/cms.service';
import { News } from '../shared/news';
import { DateUtil } from '../shared/utils/date.util';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatPaginatorModule, HvtdpImageComponent],
})
export class NewsComponent implements OnInit, OnDestroy {
  news: News[];
  htmlNews = new Map<number, string>();
  selectedNews: News;

  length: number;
  pageSize: number;

  pageSizeOptions: number[] = [1, 5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  newsId: number;
  private sub: any;
  initialOpen = true;
  isMobile = null;

  private readonly markdown = new Marked({
    breaks: true,
    gfm: true,
    walkTokens: (token) => {
      // Images and media links live on the CMS; other relative links point to this site.
      const isMedia =
        token.type === 'image' || (token.type === 'link' && token.href.startsWith('/uploads/'));
      if (isMedia) {
        token.href = this.cmsService.resolveUrl(token.href);
      }
    },
    renderer: {
      // External links open in a new tab; links within the site (e.g. /#/news/12) stay in it.
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const escapeAttr = (value: string) =>
          value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
        const external =
          /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?hvtdpstainz\.at/.test(href);
        const targetAttr = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeAttr(href)}"${titleAttr}${targetAttr}>${text}</a>`;
      },
    },
  });

  constructor(
    private cmsService: CmsService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta,
    private deviceService: DeviceDetectorService
  ) {}

  formatDate = DateUtil.formatDate;

  ngOnInit() {
    this.cmsService.getNews().subscribe((news) => {
      this.news = news;
      this.htmlNews.clear();
      // Rendered HTML is bound via [innerHTML], so Angular's sanitizer cleans it.
      news.forEach((newsItem) =>
        this.htmlNews.set(newsItem.newsId, this.markdown.parse(newsItem.content, { async: false }))
      );

      this.initPageEvent(5, 0);
      this.readRouteParams();
    });

    this.titleService.setTitle('HV TDP Stainz: News');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Die aktuellsten News über den HV TDP Stainz',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);

    this.checkDevice();
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  readRouteParams() {
    if (this.route.params == null || this.news == null || this.news.length == 0) {
      return;
    }

    this.sub = this.route.params.subscribe((params) => {
      this.newsId = +params['newsId']; // (+) converts string 'newsId' to a number
      console.log(' news id: ' + this.newsId);

      //Load news details:
      let pageIndexToSelect = 0;
      this.news.forEach((element) => {
        if (element.newsId == this.newsId) {
          this.selectedNews = element;

          console.log('selected news: ' + this.selectedNews.newsId);
          this.initPageEvent(1, pageIndexToSelect);
        }
        pageIndexToSelect++;
      });
    });
  }

  initPageEvent(pageSize, pageIndex) {
    this.length = this.news.length;
    this.pageSize = pageSize;
    this.pageEvent = new PageEvent();

    this.pageEvent.length = this.length;
    this.pageEvent.pageIndex = pageIndex;
    this.pageEvent.pageSize = this.pageSize;
  }

  opened() {
    if (!this.initialOpen) {
      this.selectedNews = null;
    }

    this.initialOpen = false;
  }
}
