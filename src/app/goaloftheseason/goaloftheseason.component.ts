import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription, forkJoin } from 'rxjs';
import { MysqlService } from '../services/mysql.service';
import { Game, Link } from '../shared/games';
import { GoalOfTheSeason } from '../shared/goaloftheseason';
import { Player } from '../shared/player';
import { CurrentSeason, Seasons } from '../shared/seasons';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ToastService } from '../ui/toast/toast.service';
import { VoteBarComponent } from '../ui/vote-bar/vote-bar.component';
import { VideoCardComponent } from '../video-card/video-card.component';

const GOAL_OF_SEASON_VOTING_COOKIE_KEY = 'goal_of_season_voted';

/** Older seasons were voted on external survey pages. */
const SURVEY_LINKS: Record<string, string> = {
  '2022': 'https://www.umfrageonline.com/c/zwsdprsc',
  '2023': 'https://www.umfrageonline.com/c/djhufanr',
};

interface Candidate {
  link: Link;
  game: Game;
  scorer: string;
  /** Voting option of the scorer, if there is one for this season. */
  option: GoalOfTheSeason | null;
}

@Component({
  selector: 'app-goal-of-the-season',
  templateUrl: './goaloftheseason.component.html',
  standalone: true,
  imports: [RouterModule, EmptyStateComponent, PageIntroComponent, VideoCardComponent, VoteBarComponent],
})
export class GoalOfTheSeasonComponent implements OnInit, OnDestroy {
  readonly seasons = Seasons.goalOfTheSeason;

  season: string;
  candidates: Candidate[] = [];
  /** Options without a nominated video (TODO(API): goal candidates and voting options are maintained separately). */
  optionsWithoutVideo: GoalOfTheSeason[] = [];
  selected: GoalOfTheSeason | null = null;
  canVote = false;
  busy = false;
  loaded = false;
  failed = false;

  private players: Player[] = [];
  private sub: Subscription;

  constructor(
    private cookieService: CookieService,
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.canVote = !this.cookieService.check(GOAL_OF_SEASON_VOTING_COOKIE_KEY);
    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.selected = null;
      this.load();
    });

    this.titleService.setTitle('HV TDP Stainz: Tor der Saison');
    this.metaTagService.updateTag({ name: 'description', content: 'Wähle das Tor der Saison vom HV TDP Stainz.' });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get votingOpen(): boolean {
    return this.season === CurrentSeason.goalOfTheSeason;
  }

  get surveyLink(): string | undefined {
    return SURVEY_LINKS[this.season];
  }

  load() {
    this.loaded = false;
    this.failed = false;
    forkJoin({
      games: this.mysqlService.getGames(),
      players: this.mysqlService.getPlayers(),
      options: this.mysqlService.getGoalOfTheSeason(),
    }).subscribe({
      next: ({ games, players, options }) => {
        this.players = players;
        const seasonOptions = options
          .filter((option) => option.season === this.season)
          .sort((a, b) => this.lastName(a.player).localeCompare(this.lastName(b.player), 'de-DE'));

        this.candidates = games
          .filter((game) => (game.date ?? '').startsWith(this.season))
          .sort((a, b) => a.date.localeCompare(b.date))
          .flatMap((game) =>
            (game.links ?? [])
              .filter((link) => Number(link.goalOfSeasonCandidate) === 1)
              .map((link) => {
                const scorer = this.scorerName(link.scorer);
                return { link, game, scorer, option: seasonOptions.find((option) => option.player === scorer) ?? null };
              })
          );
        this.optionsWithoutVideo = seasonOptions.filter(
          (option) => !this.candidates.some((candidate) => candidate.option === option)
        );
        this.loaded = true;
      },
      error: () => {
        this.loaded = true;
        this.failed = true;
      },
    });
  }

  choose(option: GoalOfTheSeason | null) {
    if (option && this.votingOpen && this.canVote) {
      this.selected = option;
    }
  }

  vote() {
    if (!this.selected) {
      return;
    }
    this.busy = true;
    this.mysqlService.postGoalOfTheSeasonVote(this.selected.season, this.selected.player).subscribe({
      next: () => {
        this.cookieService.set(GOAL_OF_SEASON_VOTING_COOKIE_KEY, 'true', 1 / 24); // expires after 1 hour
        this.canVote = false;
        this.busy = false;
        this.toastService.show('Deine Stimme wurde gezählt');
      },
      error: () => {
        this.busy = false;
        this.toastService.show('Senden fehlgeschlagen', 'error', 'Erneut', () => this.vote());
      },
    });
  }

  candidateMeta(candidate: Candidate): string {
    return candidate.link.description ? `Treffer zum ${candidate.link.description}` : candidate.game.description;
  }

  /** Links store either the last name ("Jaindl") or "Lastname Firstname". */
  private scorerName(scorer: string): string {
    const name = (scorer ?? '').trim();
    const player = this.players.find((candidate) =>
      name.includes(' ') ? `${candidate.lastName} ${candidate.firstName}` === name : candidate.lastName === name
    );
    return player ? `${player.firstName} ${player.lastName}` : name || 'Highlight';
  }

  private lastName(fullName: string): string {
    return fullName.split(' ').slice(-1)[0] ?? fullName;
  }
}
