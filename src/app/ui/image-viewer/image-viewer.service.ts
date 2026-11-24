import { Injectable, computed, inject, signal } from '@angular/core';
import { ScrollLockService } from '../scroll-lock/scroll-lock.service';

export interface ViewerImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Fullscreen image viewer (design: "Lightbox"), rendered once by `ImageViewerHostComponent`. */
@Injectable({ providedIn: 'root' })
export class ImageViewerService {
  private scrollLock = inject(ScrollLockService);

  readonly images = signal<ViewerImage[]>([]);
  readonly index = signal(0);
  readonly current = computed<ViewerImage | null>(() => this.images()[this.index()] ?? null);

  private trigger: HTMLElement | null = null;

  open(images: ViewerImage[], index = 0) {
    if (!images.length) {
      return;
    }
    this.trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.images.set(images);
    this.index.set(Math.max(0, Math.min(images.length - 1, index)));
    this.scrollLock.lock(this);
  }

  close() {
    if (!this.images().length) {
      return;
    }
    this.images.set([]);
    this.scrollLock.unlock(this);
    this.trigger?.focus();
    this.trigger = null;
  }

  step(delta: number) {
    const count = this.images().length;
    if (count > 1) {
      this.index.set((this.index() + delta + count) % count);
    }
  }
}
