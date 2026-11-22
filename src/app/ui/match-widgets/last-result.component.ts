import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatchInfo } from '../../shared/match-info';
import { MatchUtil } from '../../shared/utils/match.util';

/** Design: "Widget/LastResult" – homepage priority 1. */
@Component({
  selector: 'app-last-result',
  standalone: true,
  imports: [RouterModule, NgTemplateOutlet],
  host: { class: 'block' },
  templateUrl: './last-result.component.html',
})
export class LastResultComponent {
  readonly goalsLabel = MatchUtil.goalsLabel;

  @Input({ required: true }) match!: MatchInfo;

  get outcome() {
    return MatchUtil.outcome(this.match);
  }

  get meta(): string {
    const date = MatchUtil.formatDateTime(this.match).split(' · ')[0];
    return [this.match.label, date, this.match.venue].filter(Boolean).join(' · ');
  }

  isOwn(team: string): boolean {
    return MatchUtil.isOwnTeam(team);
  }

  initials(team: string): string {
    return MatchUtil.initials(team);
  }
}
