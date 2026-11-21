import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatchInfo } from '../../shared/match-info';
import { MatchUtil } from '../../shared/utils/match.util';

/** Design: "Widget/NextMatch" – homepage priority 2, with live countdown. */
@Component({
  selector: 'app-next-match',
  standalone: true,
  host: { class: 'block' },
  template: `
    <article class="card flex h-full flex-col gap-4 p-5">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-gray-900">Nächstes Spiel</h2>
        <span class="badge-pink">{{ isHome ? 'Heimspiel' : 'Auswärtsspiel' }}</span>
      </div>
      <p class="text-[22px] font-extrabold leading-tight text-gray-900">{{ match.homeTeam }} vs. {{ match.awayTeam }}</p>
      <div class="flex flex-col gap-1.5">
        <p class="flex items-center gap-2 text-sm font-medium text-gray-600">
          <span class="material-icons text-lg text-gray-500">event</span>{{ dateLabel }}
        </p>
        @if (match.venue) {
          <p class="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span class="material-icons text-lg text-gray-500">place</span>{{ match.venue }}
          </p>
        }
      </div>
      @if (countdown) {
        <div class="mt-auto grid grid-cols-4 gap-2" aria-label="Countdown bis zum Anpfiff">
          @for (unit of countdown; track unit.label) {
            <div class="flex flex-col items-center gap-0.5 rounded-xl bg-pink-50 py-3">
              <span class="text-[28px] font-extrabold leading-none text-pink-600">{{ unit.value }}</span>
              <span class="text-xs font-semibold text-gray-600">{{ unit.label }}</span>
            </div>
          }
        </div>
      }
    </article>
  `,
})
export class NextMatchComponent implements OnInit, OnDestroy {
  @Input({ required: true }) match: MatchInfo;

  countdown: { value: string; label: string }[] | null = null;
  private timer: ReturnType<typeof setInterval>;

  get isHome(): boolean {
    return MatchUtil.ownTeamPlaysHome(this.match);
  }

  get dateLabel(): string {
    return MatchUtil.formatDateTime(this.match.dateTime);
  }

  ngOnInit() {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private updateCountdown() {
    const kickoff = MatchUtil.parseDate(this.match.dateTime);
    const diff = kickoff ? kickoff.getTime() - Date.now() : -1;
    if (diff <= 0) {
      this.countdown = null;
      return;
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    const seconds = Math.floor(diff / 1000);
    this.countdown = [
      { value: pad(Math.floor(seconds / 86400)), label: 'Tage' },
      { value: pad(Math.floor((seconds % 86400) / 3600)), label: 'Std' },
      { value: pad(Math.floor((seconds % 3600) / 60)), label: 'Min' },
      { value: pad(seconds % 60), label: 'Sek' },
    ];
  }
}
