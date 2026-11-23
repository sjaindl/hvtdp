import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ChampionshipService } from '../services/championship.service';
import { CmsService } from '../services/cms.service';
import { Announcement } from '../shared/announcement';
import { MatchInfo } from '../shared/match-info';
import { News } from '../shared/news';
import { ErrorUtil } from '../shared/utils/error.util';
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
  private championshipService = inject(ChampionshipService);
  private cmsService = inject(CmsService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  news: News[] = [];
  newsLoaded = false;
  newsErrorText = '';
  lastResult: MatchInfo | null = null;
  nextMatch: MatchInfo | null = null;
  matchesLoaded = false;
  /** News id of the report of the last result. */
  reportNewsId: number | null = null;
  announcement = '';

  ngOnInit() {
    this.loadNews();

    // A failed request or an inactive announcement just leaves the announcement bar hidden.
    this.cmsService.getSingle<Announcement>('announcement').subscribe({
      next: (announcement) =>
        (this.announcement = announcement?.active ? (announcement.text ?? '').trim() : ''),
      error: () => (this.announcement = ''),
    });

    // Only the matches the widgets show are requested, not all seasons.
    forkJoin({
      lastResult: this.championshipService.getLastResult(),
      nextMatch: this.championshipService.getNextMatch(),
    }).subscribe({
      next: ({ lastResult, nextMatch }) => {
        this.lastResult = lastResult;
        this.nextMatch = nextMatch;
        this.matchesLoaded = true;
      },
      error: () => (this.matchesLoaded = true),
    });

    // The report link is optional: without one the last result shows no link.
    this.championshipService
      .getLastResult()
      .pipe(switchMap((match) => (match ? this.cmsService.getMatchReport(match.id) : of(null))))
      .subscribe({
        next: (newsId) => (this.reportNewsId = newsId),
        error: () => (this.reportNewsId = null),
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
    // The home page shows the latest news and four more.
    this.cmsService.getNews(5).subscribe({
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
