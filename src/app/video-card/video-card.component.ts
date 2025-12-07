import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HvtdpImageComponent } from '../hvtdp-image/hvtdp-image.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, HvtdpImageComponent],
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css'],
})
export class VideoCardComponent {
  @Input() videoUrl = '';
  @Input() scorerImage = '';
  @Input() scorerName = '';
  @Input() description = 'Video-Highlight';

  constructor(private sanitizer: DomSanitizer) {}

  get safeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl || '');
  }
}
