import { Component, Input } from '@angular/core';

const DISMISSED_KEY = 'hvtdp-announcement-dismissed';

/**
 * Design: "Banner/Announcement" – replaces the old ticker on the home page. Shows the full text (no marquee);
 * the part before the first " – " is shown bold. Closing hides it until the announcement text changes.
 */
@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  templateUrl: './announcement-bar.component.html',
})
export class AnnouncementBarComponent {
  @Input() text = '';

  private dismissedText = AnnouncementBarComponent.readDismissed();

  get visible(): boolean {
    return !!this.text.trim() && this.text !== this.dismissedText;
  }

  /** Bold part: everything before the first " – " (empty if there is none). */
  get headline(): string {
    const index = this.text.indexOf(' – ');
    return index > 0 ? this.text.slice(0, index).trim() : '';
  }

  get details(): string {
    const index = this.text.indexOf(' – ');
    return (index > 0 ? this.text.slice(index + 3) : this.text).trim();
  }

  dismiss() {
    this.dismissedText = this.text;
    try {
      localStorage.setItem(DISMISSED_KEY, this.text);
    } catch {
      // Storage blocked (e.g. private mode): the bar stays hidden for this page view only.
    }
  }

  private static readDismissed(): string | null {
    try {
      return localStorage.getItem(DISMISSED_KEY);
    } catch {
      return null;
    }
  }
}
