import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, combineLatest, forkJoin } from 'rxjs';
import { ChampionshipService } from '../services/championship.service';
import { CmsService } from '../services/cms.service';
import { MatchGoal, MatchInfo } from '../shared/match-info';
import { Scorer } from '../shared/scorer';
import { Season } from '../shared/season';
import { formatSeason } from '../shared/seasons';
import { Standing } from '../shared/standing';
import { ErrorUtil } from '../shared/utils/error.util';
import { MatchOutcome, MatchUtil } from '../shared/utils/match.util';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { NextMatchComponent } from '../ui/match-widgets/next-match.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  standalone: true,
  imports: [
    RouterModule,
    EmptyStateComponent,
    NextMatchComponent,
    PageIntroComponent,
    SlidingIndicatorDirective,
    ContentSwapDirective,
  ],
})
export class ChampionshipComponent implements OnInit, OnDestroy {
  private championshipService = inject(ChampionshipService);
  private cmsService = inject(CmsService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly formatSeason = formatSeason;
  readonly goalsLabel = (goals: MatchGoal[]) => MatchUtil.goalsLabel(goals);

  /** Seasons from Strapi, newest first (season chips). */
  seasons: Season[] = [];
  season = '';
  /** League and notes of the season shown. */
  seasonInfo: Season | null = null;
  standings: Standing[] = [];
  scorers: Scorer[] = [];
  results: MatchInfo[] = [];
  nextMatch: MatchInfo | null = null;
  loaded = false;
  failed = false;
  loading = false;
  /** Season of the content on screen; changing it plays the content entrance animation. */
  contentKey = '';
  errorText = '';

  /** Match id → news id of its report (newest report wins). */
  private reports = new Map<number, number>();
  private sub?: Subscription;

  ngOnInit() {
    // Report links are optional: without news the results just show no link.
    this.cmsService.getNews().subscribe({
      next: (news) => {
        this.reports = new Map();
        for (const item of news) {
          if (item.matchId !== null && !this.reports.has(item.matchId)) {
            this.reports.set(item.matchId, item.newsId);
          }
        }
      },
      error: () => (this.reports = new Map()),
    });

    // Without a season in the URL (/championship) the newest season is shown.
    this.sub = combineLatest([
      this.route.params,
      this.championshipService.getSeasons(true),
    ]).subscribe({
      next: ([params, seasons]) => {
        this.seasons = seasons;
        this.season = params['season'] ?? seasons[0]?.key ?? '';
        this.seasonInfo = seasons.find((season) => season.key === this.season) ?? null;
        this.load();
      },
      error: (error: unknown) => this.showError(error),
    });

    this.titleService.setTitle('HV TDP Stainz: Meisterschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Informationen über die Situation in der Meisterschaft vom HV TDP Stainz in der STT Meisterschaft.',
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  load() {
    if (!this.season) {
      return;
    }
    this.loading = true;
    this.failed = false;
    forkJoin({
      standings: this.championshipService.getStandings(this.season),
      scorers: this.championshipService.getScorers(this.season),
      matches: this.championshipService.getMatches(this.season),
    }).subscribe({
      next: ({ standings, scorers, matches }) => {
        this.standings = standings;
        this.scorers = scorers;
        this.results = MatchUtil.sortNewestFirst(
          matches.filter((match) => MatchUtil.hasScore(match))
        );
        this.nextMatch = MatchUtil.nextMatch(matches);
        this.loaded = true;
        this.loading = false;
        this.contentKey = this.season;
      },
      error: (error: unknown) => this.showError(error),
    });
  }

  /** Season notes may contain several paragraphs (blank lines). */
  paragraphs(text: string | null | undefined): string[] {
    return (text ?? '')
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  private showError(error: unknown) {
    this.loaded = true;
    this.loading = false;
    this.failed = true;
    this.errorText = ErrorUtil.message(error);
  }

  isOwn(team: string): boolean {
    return MatchUtil.isOwnTeam(team);
  }

  outcome(match: MatchInfo): MatchOutcome | null {
    return MatchUtil.outcome(match);
  }

  matchMeta(match: MatchInfo): string {
    const date = MatchUtil.formatDateTime(match).split(' · ')[0];
    return [match.label, date].filter(Boolean).join(' · ');
  }

  reportFor(match: MatchInfo): number | null {
    return this.reports.get(match.id) ?? null;
  }

  additionalInfo(match: MatchInfo): string {
    const info = (match.additionalInfo ?? '').trim();
    return !info || info === '*' || info.startsWith('(') ? info : `(${info})`;
  }

  scorerInitials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  get standingsNote(): string {
    return this.standings.length ? 'Aktueller Tabellenstand' : '';
  }
}
