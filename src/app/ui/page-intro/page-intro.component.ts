import { Component, Input } from '@angular/core';

/**
 * Page header band (gray-50) with eyebrow, title and lead text.
 * Content projection: default slot below the text (chips, buttons), [aside] slot on the right on desktop.
 */
@Component({
  selector: 'app-page-intro',
  standalone: true,
  template: `
    <section class="bg-gray-50">
      <div
        class="page-container flex flex-col gap-5 py-7 lg:flex-row lg:gap-12 lg:py-12"
        [class]="alignEnd ? 'lg:items-end' : 'lg:items-center'"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <div class="flex flex-col gap-1.5">
            @if (eyebrow) {
              <p class="eyebrow">{{ eyebrow }}</p>
            }
            <h1 class="page-title">{{ title }}</h1>
            @if (lead) {
              <p class="page-lead max-w-3xl">{{ lead }}</p>
            }
          </div>
          <ng-content></ng-content>
        </div>
        <ng-content select="[aside]"></ng-content>
      </div>
    </section>
  `,
})
export class PageIntroComponent {
  @Input() eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() lead = '';
  @Input() alignEnd = false;
}
