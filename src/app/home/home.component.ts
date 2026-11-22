import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CmsService } from '../services/cms.service';
import { MysqlService } from '../services/mysql.service';
import { Announcement } from '../shared/announcement';
import { MatchInfo } from '../shared/match-info';
import { News } from '../shared/news';
import { ErrorUtil } from '../shared/utils/error.util';
import { MatchUtil } from '../shared/utils/match.util';
import { AnnouncementBarComponent } from '../ui/announcement-bar/announcement-bar.component';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { LastResultComponent } from '../ui/match-widgets/last-result.component';
import { NextMatchComponent } from '../ui/match-widgets/next-match.component';
import { StartingElevenCtaComponent } from '../ui/match-widgets/starting-eleven-cta.component';
import { NewsCardComponent } from '../ui/news-card/news-card.component';
import { NewsRowComponent } from '../ui/news-row/news-row.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    RouterModule,
    AnnouncementBarComponent,
    EmptyStateComponent,
    LastResultComponent,
    NextMatchComponent,
    NewsCardComponent,
    NewsRowComponent,
    StartingElevenCtaComponent,
  ],
})
export class HomeComponent implements OnInit {
  private mysqlService = inject(MysqlService);
  private cmsService = inject(CmsService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  news: News[] = [];
  newsLoaded = false;
  newsErrorText = '';
  lastResult: MatchInfo | null = null;
  nextMatch: MatchInfo | null = null;
  matchesLoaded = false;
  announcement = '';

  ngOnInit() {
    this.loadNews();

    // A failed request or an inactive announcement just leaves the announcement bar hidden.
    this.cmsService.getSingle<Announcement>('announcement').subscribe({
      next: (announcement) =>
        (this.announcement = announcement?.active ? (announcement.text ?? '').trim() : ''),
      error: () => (this.announcement = ''),
    });

    this.mysqlService.getMatchInfo().subscribe({
      next: (matches) => {
        this.lastResult = MatchUtil.lastResult(matches ?? []);
        this.nextMatch = MatchUtil.nextMatch(matches ?? []);
        this.matchesLoaded = true;
      },
      error: () => (this.matchesLoaded = true),
    });

    this.titleService.setTitle('Fußballverein Stainz. HVTDP Stainz.');
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Auf der Website finden sich die aktuellen News rund um den HV TDP Stainz, den Stand in der Meisterschaft, unser Team, die Galerie, Videos und andere Highlights wie den offiziellen HV TDP Fanshop. Unter den Matchballspenden finden sich außerdem unsere Sponsoren. Auch aktuelle Umfragen und Dokumente rund um das HV TDP Vereinsleben werden zur Verfügung gestellt.',
    });
    this.metaTagService.updateTag({
      name: 'keywords',
      content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
    });
  }

  loadNews() {
    this.newsLoaded = false;
    this.newsErrorText = '';
    this.cmsService.getNews().subscribe({
      next: (news) => {
        this.news = news;
        this.newsLoaded = true;
      },
      error: (error: unknown) => {
        this.newsLoaded = true;
        this.newsErrorText = ErrorUtil.message(error);
      },
    });
  }

  get latestNews(): News | null {
    return this.news[0] ?? null;
  }

  get moreNews(): News[] {
    return this.news.slice(1, 5);
  }
}
