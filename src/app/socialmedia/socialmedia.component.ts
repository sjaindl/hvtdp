import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { MysqlService } from '../services/mysql.service';
import { Game } from '../shared/games';
import { Player } from '../shared/player';
import { Seasons, formatSeason } from '../shared/seasons';
import { DateUtil } from '../shared/utils/date.util';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  standalone: true,
  imports: [RouterModule, EmptyStateComponent, PageIntroComponent, VideoCardComponent],
})
export class SocialmediaComponent implements OnInit, OnDestroy {
  readonly seasons = Seasons.videos;
  readonly formatSeason = formatSeason;

  games: Game[] = [];
  season: string;
  players: Player[] = [];
  loaded = false;
  failed = false;
  errorText = '';

  private sub: Subscription;

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.load();
    });

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
    this.loaded = false;
    this.failed = false;
    forkJoin({ games: this.mysqlService.getGames(), players: this.mysqlService.getPlayers() }).subscribe({
      next: ({ games, players }) => {
        this.players = players;
        this.games = games
          .filter((game) => game.season == this.season && game.links?.length)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || Number(b.round) - Number(a.round));
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  gameTitle(game: Game): string {
    return (game.description ?? '').replace(/\s*:\s*/, ' – ');
  }

  gameMeta(game: Game): string {
    const round = game.customText || (Number(game.round) < 99 ? `${game.round}. Runde` : '');
    return [round, DateUtil.formatDate(game.date)].filter(Boolean).join(' · ');
  }

  scoreLabel(game: Game): string {
    const hasScore = (value: unknown) => value !== null && value !== undefined && value !== '';
    return hasScore(game.homeScore) && hasScore(game.awayScore) ? `${game.homeScore}:${game.awayScore}` : '';
  }

  /** Links store either the last name ("Jaindl") or "Lastname Firstname". */
  scorerName(scorer: string): string {
    const name = (scorer ?? '').trim();
    if (!name) {
      return 'Highlight';
    }
    const player = this.players.find((candidate) =>
      name.includes(' ')
        ? `${candidate.lastName} ${candidate.firstName}` === name
        : candidate.lastName === name
    );
    return player ? `${player.firstName} ${player.lastName}` : name;
  }
}
