import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Design: "Card/Video" (and "Card/VoteVideo" with `selectable`). Shows the YouTube thumbnail with a
 * play button and only loads the player once the user taps play.
 */
@Component({
  selector: 'app-video-card',
  standalone: true,
  host: { class: 'block' },
  templateUrl: './video-card.component.html',
})
export class VideoCardComponent implements OnChanges {
  @Input() videoUrl = '';
  @Input() title = '';
  @Input() meta = '';
  /** Small label on the right, e.g. the score "2:0". */
  @Input() badge = '';
  /** Preview image for non-YouTube videos (YouTube thumbnails are derived from the URL). */
  @Input() poster = '';
  /** Voting mode: the card body becomes a radio-style selection. */
  @Input() selectable = false;
  @Input() selected = false;
  @Output() chosen = new EventEmitter<void>();

  playing = false;
  thumbnail = '';
  isFile = false;
  playerUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const youtubeId = this.youtubeId(this.videoUrl);
    this.isFile = !youtubeId && /\.(mp4|webm|mov)$/i.test(this.videoUrl);
    this.thumbnail = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : this.poster;
    const embed = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0` : this.videoUrl;
    this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed || '');
    this.playing = false;
  }

  private youtubeId(url: string): string | null {
    const match = (url ?? '').match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    return match ? match[1] : null;
  }
}
