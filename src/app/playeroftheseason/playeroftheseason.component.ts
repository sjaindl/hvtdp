import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription, forkJoin } from 'rxjs';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Player } from '../shared/player';
import { PlayerOfTheSeason } from '../shared/playeroftheseason';
import { CurrentSeason, Seasons } from '../shared/seasons';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ToastService } from '../ui/toast/toast.service';
import { VoteBarComponent } from '../ui/vote-bar/vote-bar.component';

const PLAYER_OF_SEASON_VOTING_COOKIE_KEY = 'player_of_season_voted';

interface Candidate {
  option: PlayerOfTheSeason;
  player: Player | null;
}

@Component({
  selector: 'app-player-of-the-season',
  templateUrl: './playeroftheseason.component.html',
  standalone: true,
  imports: [RouterModule, EmptyStateComponent, PageIntroComponent, VoteBarComponent],
})
export class PlayerOfTheSeasonComponent implements OnInit, OnDestroy {
  private cookieService = inject(CookieService);
  private mysqlService = inject(MysqlService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private toastService = inject(ToastService);

  readonly seasons = Seasons.playerOfTheSeason;
  readonly imageBaseUrl = baseUrlImages;

  season = '';
  candidates: Candidate[] = [];
  selected: PlayerOfTheSeason | null = null;
  canVote = false;
  busy = false;
  loaded = false;
  failed = false;
  errorText = '';

  private sub?: Subscription;

  ngOnInit() {
    this.canVote = !this.cookieService.check(PLAYER_OF_SEASON_VOTING_COOKIE_KEY);
    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.selected = null;
      this.load();
    });

    this.titleService.setTitle('HV TDP Stainz: Spieler der Saison');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Wähle den Spieler der Saison vom HV TDP Stainz.',
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get votingOpen(): boolean {
    return this.season === CurrentSeason.playerOfTheSeason;
  }

  load() {
    this.loaded = false;
    this.failed = false;
    forkJoin({
      players: this.mysqlService.getPlayers(),
      options: this.mysqlService.getPlayerOfTheSeason(),
    }).subscribe({
      next: ({ players, options }) => {
        const lastName = (name: string) => name.split(' ').slice(-1)[0] ?? name;
        this.candidates = options
          .filter((option) => option.season === this.season)
          .sort(
            (a, b) =>
              lastName(a.player).localeCompare(lastName(b.player), 'de-DE') ||
              a.player.localeCompare(b.player)
          )
          .map((option) => ({
            option,
            player:
              players.find(
                (player) => `${player.firstName} ${player.lastName}` === option.player
              ) ?? null,
          }));
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  choose(option: PlayerOfTheSeason) {
    if (this.votingOpen && this.canVote) {
      this.selected = option;
    }
  }

  vote() {
    if (!this.selected) {
      return;
    }
    this.busy = true;
    this.mysqlService
      .postPlayerOfTheSeasonVote(this.selected.season, this.selected.player)
      .subscribe({
        next: () => {
          this.cookieService.set(PLAYER_OF_SEASON_VOTING_COOKIE_KEY, 'true', 1 / 24); // expires after 1 hour
          this.canVote = false;
          this.busy = false;
          this.toastService.show('Deine Stimme wurde gezählt');
        },
        error: (error: unknown) => {
          this.busy = false;
          this.toastService.showError('Senden fehlgeschlagen', error, 'Erneut', () => this.vote());
        },
      });
  }
}
