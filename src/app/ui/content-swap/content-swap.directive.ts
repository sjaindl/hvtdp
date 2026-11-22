import { Directive, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { forceReflow } from '../../shared/utils/dom.util';

const ENTER_CLASS = 'animate-content-in';

/**
 * Smooth content swaps, e.g. when switching seasons: while `busy` the current content stays visible but
 * dimmed, and when the key changes (new content arrived) it fades and rises in again.
 */
@Directive({
  selector: '[appContentSwap]',
  standalone: true,
  host: {
    class: 'transition-opacity duration-200',
    '[class.opacity-50]': 'busy',
    '[attr.aria-busy]': 'busy || null',
  },
})
export class ContentSwapDirective implements OnChanges {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input('appContentSwap') key: unknown;
  @Input() busy = false;

  ngOnChanges(changes: SimpleChanges) {
    const key = changes['key'];
    if (key && !key.firstChange && key.currentValue !== key.previousValue) {
      const element = this.host.nativeElement;
      element.classList.remove(ENTER_CLASS);
      forceReflow(element); // restart the animation
      element.classList.add(ENTER_CLASS);
    }
  }
}
