import { Component } from '@angular/core';
import { STARTING_ELEVEN_URL } from '../../shared/seasons';

/** Design: "Widget/Starting11" – prominent external call-to-action for the manager app. */
@Component({
  selector: 'app-starting-eleven-cta',
  standalone: true,
  host: { class: 'block' },
  templateUrl: './starting-eleven-cta.component.html',
})
export class StartingElevenCtaComponent {
  readonly url = STARTING_ELEVEN_URL;
}
