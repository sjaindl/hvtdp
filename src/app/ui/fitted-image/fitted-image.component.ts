import { Component, Input } from '@angular/core';
import { ViewerImage } from '../image-viewer/image-viewer.service';
import { ZoomableDirective } from '../image-viewer/zoomable.directive';

/**
 * Shows the whole image inside a fixed frame without cropping: the photo is contained and the free space
 * is filled with a blurred copy of it. The parent sets the frame (`aspect-*`, `overflow-hidden`) and the
 * `group` class for the hover zoom. Images that fail to load show the club logo instead.
 */
@Component({
  selector: 'app-fitted-image',
  standalone: true,
  imports: [ZoomableDirective],
  host: { class: 'relative block h-full w-full overflow-hidden bg-gray-100' },
  template: `
    @if (!failed) {
      <img [src]="src" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full scale-110 object-cover blur-xl brightness-75" loading="lazy" />
      <img
        [src]="src"
        [alt]="alt"
        class="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        [appZoomable]="zoomable"
        [zoomGroup]="zoomGroup"
        [zoomIndex]="zoomIndex"
        [zoomCaption]="caption"
        (error)="failed = true"
      />
    } @else {
      <div class="flex h-full items-center justify-center bg-pink-50">
        <img src="hvtdp.png" alt="" class="h-20 opacity-80" />
      </div>
    }
  `,
})
export class FittedImageComponent {
  @Input({ required: true }) src = '';
  @Input() alt = '';
  @Input() caption?: string;
  @Input() zoomable = true;
  @Input() zoomGroup?: ViewerImage[];
  @Input() zoomIndex = 0;

  failed = false;
}
