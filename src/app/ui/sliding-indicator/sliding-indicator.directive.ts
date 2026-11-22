import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { forceReflow } from '../../shared/utils/dom.util';

export type IndicatorMode = 'underline' | 'pill';

const UNDERLINE_HEIGHT = 2;

/**
 * Slides one shared indicator to the active item of a group instead of switching it instantly:
 * a pink underline (header navigation) or a dark pill behind chips (season and filter chips).
 * The active item is found with `activeSelector`; the indicator follows when it changes, when items
 * resize or wrap, and the active chip is scrolled into view in horizontal scrollers.
 */
@Directive({
  selector: '[appSlidingIndicator]',
  standalone: true,
})
export class SlidingIndicatorDirective implements AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input('appSlidingIndicator') mode: IndicatorMode | '' = 'pill';
  @Input() activeSelector = '.chip-active';

  private indicator?: HTMLElement;
  private active: Element | null = null;
  private frame = 0;
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    const host = this.host.nativeElement;
    const mode = this.mode || 'pill';
    host.dataset['indicator'] = mode;
    if (getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }

    this.indicator = document.createElement('span');
    this.indicator.className =
      mode === 'underline' ? 'sliding-indicator bg-pink-600' : 'sliding-indicator rounded-full bg-gray-900';
    this.indicator.setAttribute('aria-hidden', 'true');
    this.indicator.style.opacity = '0';
    host.prepend(this.indicator);

    this.update(false);

    this.mutationObserver = new MutationObserver(() => this.schedule());
    this.mutationObserver.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-current', 'data-active'],
    });
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.schedule());
      this.resizeObserver.observe(host);
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private schedule() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.update(true));
  }

  private update(animate: boolean) {
    const indicator = this.indicator;
    if (!indicator) {
      return;
    }
    const host = this.host.nativeElement;
    const active = Array.from(host.children).find(
      (child): child is HTMLElement => child !== indicator && child.matches(this.activeSelector)
    );
    if (!active) {
      indicator.style.opacity = '0';
      this.active = null;
      return;
    }

    const wasVisible = indicator.style.opacity === '1';
    const underline = host.dataset['indicator'] === 'underline';
    const top = underline ? active.offsetTop + active.offsetHeight - UNDERLINE_HEIGHT : active.offsetTop;

    // The first placement (or reappearing after no item was active) jumps instead of sliding in from 0/0.
    if (!animate || !wasVisible) {
      indicator.style.transition = 'none';
    }
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.height = `${underline ? UNDERLINE_HEIGHT : active.offsetHeight}px`;
    indicator.style.transform = `translate(${active.offsetLeft}px, ${top}px)`;
    indicator.style.opacity = '1';
    if (indicator.style.transition === 'none') {
      forceReflow(indicator); // apply the jump before transitions come back
      indicator.style.transition = '';
    }

    if (active !== this.active) {
      this.active = active;
      this.scrollIntoView(active, animate);
    }
  }

  /** Centers the active item in a horizontally scrolling group (mobile chip rows). */
  private scrollIntoView(active: HTMLElement, animate: boolean) {
    const host = this.host.nativeElement;
    if (host.scrollWidth <= host.clientWidth) {
      return;
    }
    const left = active.offsetLeft - (host.clientWidth - active.offsetWidth) / 2;
    host.scrollTo({ left: Math.max(0, left), behavior: animate ? 'smooth' : 'auto' });
  }
}
