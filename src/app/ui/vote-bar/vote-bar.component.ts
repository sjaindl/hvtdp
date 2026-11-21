import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Design: "Bar/Vote" – sticky at the bottom on mobile, inline card on desktop. */
@Component({
  selector: 'app-vote-bar',
  standalone: true,
  host: { class: 'block' },
  template: `
    <div
      class="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:static lg:mx-auto lg:max-w-lg lg:rounded-2xl lg:border lg:pb-3 lg:shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-gray-500">Deine Wahl</p>
          <p class="truncate text-base font-bold" [class]="choice ? 'text-gray-900' : 'text-gray-400'">
            {{ choice || 'Noch nichts ausgewählt' }}
          </p>
        </div>
        <button type="button" class="btn-primary" [disabled]="!choice || busy" (click)="voted.emit()">
          Abstimmen <span class="material-icons text-xl">how_to_vote</span>
        </button>
      </div>
    </div>
  `,
})
export class VoteBarComponent {
  @Input() choice = '';
  @Input() busy = false;
  @Output() voted = new EventEmitter<void>();
}
