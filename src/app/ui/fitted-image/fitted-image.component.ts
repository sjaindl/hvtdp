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
  templateUrl: './fitted-image.component.html',
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
