import { Component } from '@angular/core';
import { STARTING_ELEVEN_URL } from '../../shared/seasons';

/** Design: "Widget/Starting11" – prominent external call-to-action for the manager app. */
@Component({
  selector: 'app-starting-eleven-cta',
  standalone: true,
  host: { class: 'block' },
  template: `
    <article class="flex h-full flex-col gap-4 rounded-2xl bg-gray-900 p-6">
      <div class="flex items-center gap-3">
        <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-600">
          <span class="material-icons text-[26px] text-white">sports_soccer</span>
        </span>
        <div>
          <p class="text-[13px] font-medium text-gray-400">Unsere Manager-App</p>
          <p class="text-[22px] font-extrabold leading-tight text-white">Starting 11</p>
        </div>
      </div>
      <p class="text-[15px] leading-relaxed text-gray-200">
        Stell deine Traumelf aus dem HV TDP Kader auf, sammle Punkte bei jedem Spiel und miss dich mit anderen Fans.
      </p>
      <a [href]="url" target="_blank" rel="noopener" class="btn-primary mt-auto w-full">
        App öffnen <span class="material-icons text-xl">open_in_new</span>
      </a>
    </article>
  `,
})
export class StartingElevenCtaComponent {
  readonly url = STARTING_ELEVEN_URL;
}
