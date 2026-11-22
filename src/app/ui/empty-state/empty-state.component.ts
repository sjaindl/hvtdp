import { Component, Input } from '@angular/core';

/**
 * Design: "State/Empty|Error|Success". Project an optional action button as content.
 * `tone="pink"` is used for positive states (e.g. success).
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  host: { class: 'block' },
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input({ required: true }) title = '';
  @Input() text = '';
  @Input() tone: 'neutral' | 'error' | 'pink' = 'neutral';
}
