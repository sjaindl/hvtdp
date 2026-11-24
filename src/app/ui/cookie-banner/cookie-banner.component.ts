import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AnalyticsService } from '../../services/analytics.service';
import { ImageViewerService } from '../image-viewer/image-viewer.service';
import { CookieConsentService } from './cookie-consent.service';

/** Same cookie as the previous cookieconsent library, so existing choices are kept. */
const CONSENT_COOKIE = 'cookieconsent_status';

/**
 * Cookie consent (design: "Cookie/Banner/Mobile|Desktop"). Accept and reject are offered on the
 * first layer with equal size. Google Analytics is loaded only after "Alle akzeptieren". The footer link
 * "Cookie-Einstellungen" opens the banner again, so the choice can be changed or withdrawn.
 */
@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cookie-banner.component.html',
})
export class CookieBannerComponent implements OnInit {
  private cookieService = inject(CookieService);
  private analytics = inject(AnalyticsService);
  private consent = inject(CookieConsentService);
  readonly imageViewer = inject(ImageViewerService);

  get visible(): boolean {
    return this.consent.bannerVisible();
  }

  ngOnInit() {
    const status = this.cookieService.get(CONSENT_COOKIE);
    this.consent.bannerVisible.set(!status);
    if (status === 'allow') {
      this.analytics.enable();
    } else {
      this.analytics.disable();
    }
  }

  choose(status: 'allow' | 'deny') {
    const domain = location.hostname.endsWith('hvtdpstainz.at') ? 'hvtdpstainz.at' : undefined;
    this.cookieService.set(CONSENT_COOKIE, status, {
      expires: 365,
      path: '/',
      domain,
      sameSite: 'Lax',
    });
    if (status === 'allow') {
      this.analytics.enable();
    } else {
      this.analytics.disable();
    }
    this.consent.bannerVisible.set(false);
  }
}
