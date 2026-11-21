import { Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ImageViewerService } from './image-viewer.service';

@Component({
  selector: 'app-image-viewer-host',
  standalone: true,
  template: `
    @if (viewer.current(); as image) {
      <div
        class="fixed inset-0 z-[80] flex flex-col bg-gray-900 outline-none"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="image.alt || 'Bild'"
        tabindex="-1"
        (click)="onBackdropClick($event)"
        (keydown)="onKeydown($event)"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        <div class="flex items-center justify-between pl-4 pr-2 pt-3">
          <span class="text-[15px] font-semibold text-white">
            @if (count > 1) {
              {{ viewer.index() + 1 }} / {{ count }}
            }
          </span>
          <button
            #closeButton
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Schließen"
            (click)="viewer.close()"
          >
            <span class="material-icons text-[26px]">close</span>
          </button>
        </div>
        <div class="relative flex min-h-0 flex-1 items-center justify-center p-4" data-backdrop>
          @if (loadedSrc !== image.src) {
            <span
              class="absolute h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white"
              aria-hidden="true"
            ></span>
          }
          <img
            [src]="image.src"
            [alt]="image.alt"
            class="max-h-full max-w-full object-contain transition-opacity duration-200 lg:max-w-6xl"
            [class.opacity-0]="loadedSrc !== image.src"
            (load)="loadedSrc = image.src"
            (error)="loadedSrc = image.src"
          />
        </div>
        <div class="flex min-h-[76px] items-center justify-between gap-3 px-4 pb-7">
          @if (count > 1) {
            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Vorheriges Bild"
              (click)="viewer.step(-1)"
            >
              <span class="material-icons text-[26px]">chevron_left</span>
            </button>
          }
          <span class="flex-1 truncate text-center text-sm font-medium text-gray-400">{{
            image.caption ?? image.alt
          }}</span>
          @if (count > 1) {
            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Nächstes Bild"
              (click)="viewer.step(1)"
            >
              <span class="material-icons text-[26px]">chevron_right</span>
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class ImageViewerHostComponent {
  viewer = inject(ImageViewerService);

  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;

  loadedSrc: string | null = null;
  private touchStartX: number | null = null;

  constructor() {
    const router = inject(Router);

    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => this.viewer.close());

    // Move focus into the dialog when it opens (`images` only changes on open/close, not when stepping).
    effect(() => {
      if (this.viewer.images().length) {
        setTimeout(() => this.closeButton?.nativeElement.focus());
      }
    });
  }

  get count(): number {
    return this.viewer.images().length;
  }

  /** A tap next to the image (on the dark area around it) closes the viewer. */
  onBackdropClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('data-backdrop')) {
      this.viewer.close();
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    if (this.touchStartX === null) {
      return;
    }
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(delta) > 50) {
      this.viewer.step(delta < 0 ? 1 : -1);
    }
    this.touchStartX = null;
  }

  /** Keys are handled on the dialog, which holds the focus while it's open. */
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.viewer.close();
    if (event.key === 'ArrowRight') this.viewer.step(1);
    if (event.key === 'ArrowLeft') this.viewer.step(-1);
  }
}
