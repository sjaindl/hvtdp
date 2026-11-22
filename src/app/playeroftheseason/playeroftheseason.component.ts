import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription, combineLatest, of, switchMap } from 'rxjs';
import { PollService } from '../services/poll.service';
import { Poll, PollOption } from '../shared/poll';
import { ErrorUtil } from '../shared/utils/error.util';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';
import { ToastService } from '../ui/toast/toast.service';
import { VoteBarComponent } from '../ui/vote-bar/vote-bar.component';

const PLAYER_OF_SEASON_VOTING_COOKIE_KEY = 'player_of_season_voted';

@Component({
  selector: 'app-player-of-the-season',
  templateUrl: './playeroftheseason.component.html',
  standalone: true,
  imports: [
    RouterModule,
    EmptyStateComponent,
    PageIntroComponent,
    VoteBarComponent,
    SlidingIndicatorDirective,
    ContentSwapDirective,
  ],
})
export class PlayerOfTheSeasonComponent implements OnInit, OnDestroy {
  private cookieService = inject(CookieService);
  private pollService = inject(PollService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private toastService = inject(ToastService);

  /** Years with a voting, newest first. */
  polls: Poll[] = [];
  poll: Poll | null = null;
  season = '';
  candidates: PollOption[] = [];
  selected: PollOption | null = null;
  canVote = false;
  busy = false;
  loaded = false;
  failed = false;
  loading = false;
  /** Season of the content on screen; changing it plays the content entrance animation. */
  contentKey = '';
  errorText = '';

  private sub?: Subscription;

  ngOnInit() {
    this.canVote = !this.cookieService.check(PLAYER_OF_SEASON_VOTING_COOKIE_KEY);
    this.load();

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
    return this.poll?.open ?? false;
  }

  load() {
    this.sub?.unsubscribe();
    this.loading = true;
    this.failed = false;
    // Without a year in the URL (/playeroftheseason) the newest voting is shown.
    this.sub = combineLatest([this.route.params, this.pollService.getPolls('playerOfTheYear')])
      .pipe(
        switchMap(([params, polls]) => {
          this.polls = polls;
          this.season = params['season'] ?? polls[0]?.year ?? '';
          this.poll = polls.find((poll) => poll.year === this.season) ?? null;
          this.selected = null;
          return this.poll ? this.pollService.getOptions('playerOfTheYear', this.season) : of([]);
        })
      )
      .subscribe({
        next: (options) => {
          const lastName = (name: string) => name.split(' ').slice(-1)[0] ?? name;
          this.candidates = [...options].sort(
            (a, b) =>
              lastName(a.name).localeCompare(lastName(b.name), 'de-DE') ||
              a.name.localeCompare(b.name)
          );
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

  choose(option: PollOption) {
    if (this.votingOpen && this.canVote) {
      this.selected = option;
    }
  }

  vote() {
    if (!this.selected) {
      return;
    }
    this.busy = true;
    this.pollService.vote(this.selected).subscribe({
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
