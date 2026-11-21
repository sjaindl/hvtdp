import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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
  template: `
    @if (visible) {
      <div
        class="fixed inset-x-0 bottom-0 z-[2147483000] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8 md:pb-6"
        role="dialog"
        aria-labelledby="cookie-title"
      >
        <div
          class="mx-auto flex max-w-page flex-col gap-3.5 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl md:flex-row md:items-center md:gap-8 md:px-6"
        >
          <span class="material-icons hidden text-[32px] text-pink-600 md:block">cookie</span>
          <div class="flex-1">
            <div class="flex items-center gap-2.5">
              <span class="material-icons text-pink-600 md:hidden">cookie</span>
              <h2 id="cookie-title" class="text-[17px] font-bold text-gray-900">Cookies &amp; Datenschutz</h2>
            </div>
            <p class="mt-1.5 text-sm leading-relaxed text-gray-600">
              Wir verwenden Cookies, um dir die bestmögliche Nutzung unserer Website zu ermöglichen und
              Zugriffe anonym auszuwerten.
              <!-- TODO(content): link a dedicated privacy page once it exists. -->
              <a routerLink="/contact" class="font-semibold text-pink-600 hover:text-pink-700">Mehr erfahren</a>
            </p>
          </div>
          <div class="flex flex-col gap-2.5 md:flex-row-reverse">
            <button type="button" class="btn-primary" (click)="choose('allow')">
              Alle akzeptieren <span class="material-icons text-xl">check</span>
            </button>
            <button type="button" class="btn-secondary" (click)="choose('deny')">Nur notwendige</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookieBannerComponent implements OnInit {
  visible = false;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    const status = this.cookieService.get(CONSENT_COOKIE);
    this.visible = !status;
    if (status === 'deny') {
      this.disableAnalytics();
    }
  }

  choose(status: 'allow' | 'deny') {
    const domain = location.hostname.endsWith('hvtdpstainz.at') ? 'hvtdpstainz.at' : undefined;
    this.cookieService.set(CONSENT_COOKIE, status, { expires: 365, path: '/', domain, sameSite: 'Lax' });
    if (status === 'deny') {
      this.disableAnalytics();
    }
    this.visible = false;
  }

  private disableAnalytics() {
    ANALYTICS_IDS.forEach((id) => ((window as any)['ga-disable-' + id] = true));
  }
}
