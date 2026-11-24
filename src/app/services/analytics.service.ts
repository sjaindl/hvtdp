import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const MEASUREMENT_ID = 'G-FNF110XEHW';

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag } & Record<string, unknown>;

/**
 * Google Analytics 4, loaded only after the visitor agreed in the cookie banner ("Alle akzeptieren").
 * Without consent no script is requested from Google and no cookie is set.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private loaded = false;

  private get window(): AnalyticsWindow | null {
    return (this.document.defaultView as AnalyticsWindow | null) ?? null;
  }

  /** Loads gtag.js once and reports the current page and every route change as page view. */
  enable() {
    const win = this.window;
    if (!win) {
      return;
    }
    win[`ga-disable-${MEASUREMENT_ID}`] = false;
    if (this.loaded) {
      return;
    }
    this.loaded = true;

    win.dataLayer = win.dataLayer ?? [];
    win.gtag = function gtag() {
      // gtag.js expects the arguments object, not an array.
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer?.push(arguments);
    };
    win.gtag('js', new Date());
    // Hash routing: page views are sent on navigation instead of on load.
    win.gtag('config', MEASUREMENT_ID, { send_page_view: false });

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    this.document.head.appendChild(script);

    this.pageView();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.pageView());
  }

  /** Stops tracking (consent withdrawn or refused) and removes Google Analytics cookies. */
  disable() {
    const win = this.window;
    if (!win) {
      return;
    }
    win[`ga-disable-${MEASUREMENT_ID}`] = true;
    const host = win.location.hostname;
    const domains = ['', host, `.${host}`, '.hvtdpstainz.at'];
    for (const name of this.document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())) {
      if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
        for (const domain of domains) {
          this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
        }
      }
    }
  }

  private pageView() {
    const win = this.window;
    win?.gtag?.('event', 'page_view', {
      page_location: win.location.href,
      page_path: win.location.hash.replace(/^#/, '') || '/',
      page_title: this.document.title,
    });
  }
}
