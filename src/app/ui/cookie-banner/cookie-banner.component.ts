import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ImageViewerService } from '../image-viewer/image-viewer.service';

/** Same cookie as the previous cookieconsent library, so existing choices are kept. */
const CONSENT_COOKIE = 'cookieconsent_status';
const ANALYTICS_IDS = ['UA-122732749-1', 'G-FNF110XEHW'];

/**
 * Cookie consent (design: "Cookie/Banner/Mobile|Desktop"). Accept and reject are offered on the
 * first layer with equal size.
 * TODO(consent): load Google Analytics only after consent instead of disabling it after the fact
 * (gtag is currently embedded unconditionally in index.html).
 */
@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cookie-banner.component.html',
})
export class CookieBannerComponent implements OnInit {
  private cookieService = inject(CookieService);
  readonly imageViewer = inject(ImageViewerService);

  visible = false;

  ngOnInit() {
    const status = this.cookieService.get(CONSENT_COOKIE);
    this.visible = !status;
    if (status === 'deny') {
      this.disableAnalytics();
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
    if (status === 'deny') {
      this.disableAnalytics();
    }
    this.visible = false;
  }

  private disableAnalytics() {
    ANALYTICS_IDS.forEach((id) => ((window as unknown as Record<string, boolean>)['ga-disable-' + id] = true));
  }
}
