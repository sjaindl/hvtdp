import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { forceReflow } from '../../shared/utils/dom.util';

const DURATION_MS = 320;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Text shortened to a number of lines with "…" and a "Mehr anzeigen" toggle, which only appears when the
 * text really is longer (measured, so it adapts to the card width). Expanding and collapsing animate the
 * height; the clamp itself (which CSS cannot animate) is lifted before and reapplied after the animation.
 */
@Component({
  selector: 'app-clamped-text',
  standalone: true,
  host: { class: 'block' },
  templateUrl: './clamped-text.component.html',
})
export class ClampedTextComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) text = '';
  @Input() lines = 3;
  /** Classes for the text paragraph (size, color …). */
  @Input() textClass = '';

  @ViewChild('content') content?: ElementRef<HTMLElement>;

  readonly expanded = signal(false);
  readonly overflowing = signal(false);

  private observer?: ResizeObserver;
  private frame = 0;
  private finishTimer?: ReturnType<typeof setTimeout>;
  private viewReady = false;

  ngAfterViewInit() {
    // Runs before the first paint, so the text never shows unclamped.
    this.viewReady = true;
    this.setClamp(true);
    this.measure();
    if (typeof ResizeObserver !== 'undefined' && this.content) {
      this.observer = new ResizeObserver(() => this.scheduleMeasure());
      this.observer.observe(this.content.nativeElement);
    }
  }

  ngOnChanges() {
    if (!this.viewReady) {
      return;
    }
    this.cancelAnimation();
    this.expanded.set(false);
    this.setClamp(true);
    this.scheduleMeasure();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    clearTimeout(this.finishTimer);
    this.observer?.disconnect();
  }

  toggle() {
    if (this.expanded()) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private expand() {
    const element = this.content?.nativeElement;
    if (!element) {
      return;
    }
    this.cancelAnimation();
    const from = element.getBoundingClientRect().height;
    this.setClamp(false);
    const to = element.scrollHeight;
    this.expanded.set(true);
    this.animateHeight(element, from, to, () => (element.style.overflow = ''));
  }

  private collapse() {
    const element = this.content?.nativeElement;
    if (!element) {
      return;
    }
    this.cancelAnimation();
    const from = element.getBoundingClientRect().height;
    // Measure the clamped height without painting it.
    this.setClamp(true);
    const to = element.getBoundingClientRect().height;
    this.setClamp(false);
    element.style.overflow = 'hidden';
    this.expanded.set(false);
    this.animateHeight(element, from, to, () => this.setClamp(true));
  }

  /** Animates the height between two pixel values, then removes the inline height again. */
  private animateHeight(element: HTMLElement, from: number, to: number, done: () => void) {
    element.style.height = `${from}px`;
    forceReflow(element); // apply the start height before the transition
    element.style.transition = `height ${DURATION_MS}ms ${EASING}`;
    element.style.height = `${to}px`;

    const finish = () => {
      clearTimeout(this.finishTimer);
      element.removeEventListener('transitionend', onEnd);
      element.style.transition = '';
      element.style.height = '';
      done();
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'height') {
        finish();
      }
    };
    element.addEventListener('transitionend', onEnd);
    // Fallback when no transition runs (same height, reduced motion, hidden element).
    this.finishTimer = setTimeout(finish, DURATION_MS + 80);
  }

  private cancelAnimation() {
    clearTimeout(this.finishTimer);
    const element = this.content?.nativeElement;
    if (element) {
      element.style.transition = '';
      element.style.height = '';
    }
  }

  private setClamp(clamped: boolean) {
    const style = this.content?.nativeElement.style;
    if (!style) {
      return;
    }
    style.display = clamped ? '-webkit-box' : '';
    style.setProperty('-webkit-box-orient', clamped ? 'vertical' : '');
    style.setProperty('-webkit-line-clamp', clamped ? String(this.lines) : '');
    style.overflow = clamped ? 'hidden' : '';
  }

  private scheduleMeasure() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.measure());
  }

  /** Only measurable while clamped; when expanded the toggle stays visible to collapse again. */
  private measure() {
    const element = this.content?.nativeElement;
    if (element && !this.expanded()) {
      this.overflowing.set(element.scrollHeight > element.clientHeight + 1);
    }
  }
}
