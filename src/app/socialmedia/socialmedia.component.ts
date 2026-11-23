import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  private router = inject(Router);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly formatSeason = formatSeason;

  /** Seasons that have videos, newest first. */
  seasons: string[] = [];
  season = '';
  /** Everyone with a goal video, by last name, with the number of videos. */
  players: { name: string; count: number }[] = [];
  /** Player filter (`?spieler=`): his goals from all seasons instead of one season. */
  player: string | null = null;
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
    this.sub = combineLatest([
      this.route.params,
      this.route.queryParams,
      this.videoService.getMatchVideos(),
    ]).subscribe({
      next: ([params, queryParams, all]) => {
        this.seasons = [...new Set(all.map((item) => item.match.season))].sort().reverse();
        this.season = params['season'] ?? this.seasons[0] ?? '';
        this.players = SocialmediaComponent.playersOf(all);
        this.player = this.players.some((entry) => entry.name === queryParams['spieler'])
          ? queryParams['spieler']
          : null;
        const player = this.player;
        this.items = player
          ? all
              .map((item) => ({
                ...item,
                videos: item.videos.filter((video) => video.scorer === player),
              }))
              .filter((item) => item.videos.length)
          : all.filter((item) => item.match.season === this.season);
        this.loaded = true;
        this.loading = false;
        this.contentKey = player ? `player:${player}` : this.season;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.loading = false;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  /** Chooses a player (or none) and keeps the choice in the URL. */
  selectPlayer(name: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { spieler: name || null },
      queryParamsHandling: 'merge',
    });
  }

  /** Scorers of all videos (not "Eigentor"), sorted by last name. */
  static playersOf(all: MatchVideos[]): { name: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const video of all.flatMap((item) => item.videos)) {
      if (video.scorer && video.scorer !== 'Eigentor') {
        counts.set(video.scorer, (counts.get(video.scorer) ?? 0) + 1);
      }
    }
    const lastName = (name: string) => name.split(' ').slice(-1)[0] ?? name;
    return [...counts]
      .map(([name, count]) => ({ name, count }))
      .sort(
        (a, b) =>
          lastName(a.name).localeCompare(lastName(b.name), 'de-DE') ||
          a.name.localeCompare(b.name, 'de-DE')
      );
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
