import { Component, Input } from '@angular/core';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';

@Component({
  selector: 'app-hvtdp-image',
  templateUrl: './hvtdp-image.component.html',
  styleUrls: ['./hvtdp-image.component.css'],
  standalone: true,
  imports: [ZoomableDirective],
})
export class HvtdpImageComponent {
  @Input() imagePath: string;
  @Input() altText = '';
}
