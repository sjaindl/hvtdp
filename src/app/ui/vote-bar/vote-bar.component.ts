import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Design: "Bar/Vote" – sticky at the bottom on mobile, inline card on desktop. */
@Component({
  selector: 'app-vote-bar',
  standalone: true,
  host: { class: 'block' },
  templateUrl: './vote-bar.component.html',
})
export class VoteBarComponent {
  @Input() choice = '';
  @Input() busy = false;
  @Output() voted = new EventEmitter<void>();
}
