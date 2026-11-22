import { Component, Input } from '@angular/core';
import { baseUrlImages } from '../../shared/baseurls';
import { Player } from '../../shared/player';
import { ZoomableDirective } from '../image-viewer/zoomable.directive';

/** Design: "Card/Player" – photo, position, name, member since, games and goals. */
@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [ZoomableDirective],
  host: { class: 'block' },
  templateUrl: './player-card.component.html',
})
export class PlayerCardComponent {
  @Input({ required: true }) player!: Player;
  /** Position label shown above the name (e.g. "Tormann"); omit for members without a position. */
  @Input() position = '';

  readonly imageBaseUrl = baseUrlImages;

  get hasGames(): boolean {
    return this.player.games !== null && this.player.games !== undefined;
  }

  get hasGoals(): boolean {
    return this.player.goals !== null && this.player.goals !== undefined;
  }

  get name(): string {
    return `${this.player.firstName} ${this.player.lastName}`;
  }
}
