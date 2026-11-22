import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { VideoService } from '../services/video.service';
import { MatchInfo } from '../shared/match-info';
import { formatSeason } from '../shared/seasons';
import { MatchVideos, Video } from '../shared/video';
import { MatchUtil } from '../shared/utils/match.util';
import { ErrorUtil } from '../shared/utils/error.util';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  standalone: true,
  imports: [
    RouterModule,
    EmptyStateComponent,
    PageIntroComponent,
    VideoCardComponent,
    SlidingIndicatorDirective,
    ContentSwapDirective,
  ],
})
export class SocialmediaComponent implements OnInit, OnDestroy {
  private videoService = inject(VideoService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly formatSeason = formatSeason;

  /** Seasons that have videos, newest first. */
  seasons: string[] = [];
  season = '';
  items: MatchVideos[] = [];
  loaded = false;
  failed = false;
  loading = false;
  /** Season of the content on screen; changing it plays the content entrance animation. */
  contentKey = '';
  errorText = '';

  private sub?: Subscription;

  ngOnInit() {
    this.load();
    this.titleService.setTitle('HV TDP Stainz: Videos');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Videos von Veranstaltungen und Toren vom HV TDP Stainz.',
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  load() {
    this.sub?.unsubscribe();
    this.loading = true;
    this.failed = false;
    // Without a season in the URL (/social) the newest season is shown.
    this.sub = combineLatest([this.route.params, this.videoService.getMatchVideos()]).subscribe({
      next: ([params, all]) => {
        this.seasons = [...new Set(all.map((item) => item.match.season))].sort().reverse();
        this.season = params['season'] ?? this.seasons[0] ?? '';
        this.items = all.filter((item) => item.match.season === this.season);
        this.loaded = true;
        this.loading = false;
        this.contentKey = this.season;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.loading = false;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  /** "HV TDP Stainz – STT Pichler", or the title of an event. */
  title(match: MatchInfo): string {
    return match.title ?? `${match.homeTeam} – ${match.awayTeam}`;
  }

  /** "5. Runde · Sa, 12.09.2026"; events only show the date. */
  meta(match: MatchInfo): string {
    const date = MatchUtil.formatDateTime({ kickoff: match.kickoff, hasTime: false });
    return [match.competition === 'Event' ? '' : match.label, date].filter(Boolean).join(' · ');
  }

  scoreLabel(match: MatchInfo): string {
    return MatchUtil.hasScore(match) ? `${match.homeScore}:${match.awayScore}` : '';
  }

  videoTitle(video: Video): string {
    return video.scorer ?? 'Highlight';
  }
}
