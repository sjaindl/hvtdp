import { Component, Input } from '@angular/core';

/**
 * Page header band (gray-50) with eyebrow, title and lead text.
 * Content projection: default slot below the text (chips, buttons), [aside] slot on the right on desktop.
 */
@Component({
  selector: 'app-page-intro',
  standalone: true,
  templateUrl: './page-intro.component.html',
})
export class PageIntroComponent {
  @Input() eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() lead = '';
  @Input() alignEnd = false;
}
