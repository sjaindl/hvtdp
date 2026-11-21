import { Directive, ElementRef, HostBinding, HostListener, Input, inject } from '@angular/core';
import { ImageViewerService, ViewerImage } from './image-viewer.service';

/**
 * Opens an `<img>` in the fullscreen viewer on click, Enter or Space.
 * Pass `zoomGroup` + `zoomIndex` to browse a whole set (e.g. an album) from this image.
 */
@Directive({
  selector: 'img[appZoomable]',
  standalone: true,
})
export class ZoomableDirective {
  private element = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private viewer = inject(ImageViewerService);

  /** Set to `false` to switch the behaviour off (e.g. `[appZoomable]="isPhoto"`). */
  @Input() appZoomable: boolean | '' = true;
  @Input() zoomGroup?: ViewerImage[];
  @Input() zoomIndex = 0;
  @Input() zoomCaption?: string;

  private failed = false;

  @HostBinding('class.cursor-zoom-in')
  get enabled(): boolean {
    return this.appZoomable !== false && !this.failed;
  }

  @HostBinding('attr.role')
  get role(): string | null {
    return this.enabled ? 'button' : null;
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number | null {
    return this.enabled ? 0 : null;
  }

  @HostBinding('attr.aria-label')
  get ariaLabel(): string | null {
    const alt = this.element.nativeElement.alt;
    return this.enabled ? (alt ? `${alt} vergrößern` : 'Bild vergrößern') : null;
  }

  @HostListener('error')
  onError() {
    this.failed = true;
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  open(event: Event) {
    if (!this.enabled) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.zoomGroup?.length) {
      this.viewer.open(this.zoomGroup, this.zoomIndex);
      return;
    }
    const image = this.element.nativeElement;
    this.viewer.open([
      { src: image.currentSrc || image.src, alt: image.alt, caption: this.zoomCaption },
    ]);
  }
}
