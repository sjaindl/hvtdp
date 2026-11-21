import { Component, Input } from '@angular/core';

/**
 * Design: "State/Empty|Error|Success". Project an optional action button as content.
 * `tone="pink"` is used for positive states (e.g. success).
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  host: { class: 'block' },
  template: `
    <div
      class="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center"
      [attr.role]="tone === 'error' ? 'alert' : null"
    >
      <span
        class="flex h-[72px] w-[72px] items-center justify-center rounded-full"
        [class]="tone === 'pink' ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-500'"
      >
        <span class="material-icons text-4xl">{{ icon }}</span>
      </span>
      <h2 class="text-lg font-bold leading-snug text-gray-900">{{ title }}</h2>
      @if (text) {
        <p class="text-[15px] leading-relaxed text-gray-600">{{ text }}</p>
      }
      <div class="pt-2"><ng-content></ng-content></div>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input({ required: true }) title = '';
  @Input() text = '';
  @Input() tone: 'neutral' | 'error' | 'pink' = 'neutral';
}
