import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { STARTING_ELEVEN_URL } from '../shared/seasons';

const REDIRECT_DELAY_MS = 3000;

/** Short interstitial before leaving for the external Starting 11 manager app. */
@Component({
  selector: 'app-startingeleven',
  templateUrl: './startingeleven.component.html',
  styles: ['@keyframes redirect-progress { from { width: 0; } to { width: 100%; } }'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterModule],
})
export class StartingelevenComponent implements OnInit, OnDestroy {
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly url = STARTING_ELEVEN_URL;
  readonly host = new URL(STARTING_ELEVEN_URL).host;
  readonly delaySeconds = REDIRECT_DELAY_MS / 1000;
  private timer: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Starting 11');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Weiterleitung zur Starting 11 Manager-App.',
    });
    this.timer = setTimeout(() => window.location.assign(this.url), REDIRECT_DELAY_MS);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
