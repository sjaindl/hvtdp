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
  template: `
    <article class="card-interactive group flex h-full flex-col">
      <div class="aspect-[6/7] overflow-hidden bg-gray-100">
        <img [src]="imageBaseUrl + player.imagePath" [alt]="name" class="card-media object-top" loading="lazy" appZoomable />
      </div>
      <div class="flex flex-1 flex-col gap-1.5 px-3.5 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        @if (position) {
          <p class="text-[13px] font-semibold text-pink-600">{{ position }}</p>
        }
        <h3 class="text-base font-bold leading-snug text-gray-900 sm:text-xl">{{ name }}</h3>
        @if (player.memberSinceYear) {
          <p class="flex items-center gap-1.5 text-sm font-medium text-gray-500">
            <span class="material-icons text-base">calendar_today</span>
            <span><span class="sm:hidden">Seit</span><span class="hidden sm:inline">Im Team seit</span> {{ player.memberSinceYear }}</span>
          </p>
        }
        @if (hasGames || hasGoals) {
          <p class="mt-auto flex gap-4 pt-1.5 text-[13px] font-medium text-gray-500">
            @if (hasGames) {
              <span><span class="text-[15px] font-extrabold text-gray-900">{{ player.games }}</span> Spiele</span>
            }
            @if (hasGoals) {
              <span><span class="text-[15px] font-extrabold text-gray-900">{{ player.goals }}</span> Tore</span>
            }
          </p>
        }
      </div>
    </article>
  `,
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
