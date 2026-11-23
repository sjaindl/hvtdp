import { Injectable, signal } from '@angular/core';

/** Visibility of the cookie banner; "Cookie-Einstellungen" (footer) reopens it to change or withdraw consent. */
@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  readonly bannerVisible = signal(false);

  reopen() {
    this.bannerVisible.set(true);
  }
}
