import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HvtdpImageComponent } from '../hvtdp-image/hvtdp-image.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, HvtdpImageComponent],
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css'],
})
export class VideoCardComponent implements OnChanges {
  @Input() videoUrl = '';
  @Input() scorerImage = '';
  @Input() scorerName = '';
  @Input() description = 'Video-Highlight';
  safeUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl']) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl || '');
    }
  }
}
