import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Locks page scrolling while overlays (menu, sheets, viewer) are open. Each overlay locks with
 * itself as owner, so closing one keeps the page locked while another one is still open.
 */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private document = inject(DOCUMENT);
  private readonly owners = new Set<object>();

  lock(owner: object) {
    this.owners.add(owner);
    this.update();
  }

  /** Safe to call when the owner holds no lock (e.g. from ngOnDestroy). */
  unlock(owner: object) {
    this.owners.delete(owner);
    this.update();
  }

  private update() {
    this.document.body.classList.toggle('overflow-hidden', this.owners.size > 0);
  }
}
