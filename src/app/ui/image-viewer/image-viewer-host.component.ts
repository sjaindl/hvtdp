import { Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ImageViewerService } from './image-viewer.service';

@Component({
  selector: 'app-image-viewer-host',
  standalone: true,
  templateUrl: './image-viewer-host.component.html',
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
