import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatchInfo } from '../../shared/match-info';
import { MatchUtil } from '../../shared/utils/match.util';

/** Design: "Widget/NextMatch" – homepage priority 2, with live countdown. */
@Component({
  selector: 'app-next-match',
  standalone: true,
  host: { class: 'block' },
  templateUrl: './next-match.component.html',
})
export class NextMatchComponent implements OnInit, OnDestroy {
  @Input({ required: true }) match!: MatchInfo;

  countdown: { value: string; label: string }[] | null = null;
  private timer?: ReturnType<typeof setInterval>;

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
