import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { MysqlService } from '../services/mysql.service';
import { MatchInfo } from '../shared/match-info';
import { Scorer } from '../shared/scorer';
import { Seasons, formatSeason } from '../shared/seasons';
import { Standing } from '../shared/standing';
import { ErrorUtil } from '../shared/utils/error.util';
import { MatchOutcome, MatchUtil } from '../shared/utils/match.util';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { NextMatchComponent } from '../ui/match-widgets/next-match.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';

interface SeasonContent {
  /** TODO(API): the league name is not part of the API yet. */
  league: string;
  preface?: string[];
  postResults?: string[];
}

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
  private mysqlService = inject(MysqlService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly seasons = Seasons.championship;
  readonly formatSeason = formatSeason;

  season = '';
  seasonContent = this.getSeasonContent('');
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

  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.seasonContent = this.getSeasonContent(this.season);
      this.load();
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
    this.loading = true;
    this.failed = false;
    forkJoin({
      standings: this.mysqlService.getStandings(),
      scorers: this.mysqlService.getScorers(),
      matches: this.mysqlService.getMatchInfo(),
    }).subscribe({
      next: ({ standings, scorers, matches }) => {
        this.standings = standings
          .filter((standing) => standing.season == this.season)
          .sort((a, b) => Number(a.place) - Number(b.place));
        this.scorers = scorers
          .filter((scorer) => Number(scorer.goals) > 0 && scorer.season == this.season)
          .sort(
            (a, b) => Number(b.goals) - Number(a.goals) || a.playerName.localeCompare(b.playerName)
          );
        const seasonMatches = (matches ?? []).filter((match) => match.season == this.season);
        this.results = MatchUtil.sortNewestFirst(
          seasonMatches.filter((match) => MatchUtil.hasScore(match))
        );
        this.nextMatch = MatchUtil.nextMatch(seasonMatches);
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

  isOwn(team: string): boolean {
    return MatchUtil.isOwnTeam(team);
  }

  outcome(match: MatchInfo): MatchOutcome | null {
    return MatchUtil.outcome(match);
  }

  matchMeta(match: MatchInfo): string {
    const date = MatchUtil.formatDateTime(match.dateTime).split(' · ')[0];
    return [match.matchInfo, date].filter(Boolean).join(' · ');
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

  private getSeasonContent(season: string): SeasonContent {
    const content: Record<string, Partial<SeasonContent>> = {
      '2022-2023': {
        postResults: [
          '* Spiel wird offiziell nicht gewertet, da Gössnitz aus der Liga ausgestiegen ist.',
        ],
      },
      '2021-2022': {
        preface: [
          'Die Plätze 1 bis 3 spielen am Ende der Saison in einem Play-off gegen die Plätze 5 bis 8 aus Liga A um den Aufstieg.',
        ],
      },
    };
    return { league: 'Liga B', ...content[season] };
  }
}
