import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard {
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    window.location.href = route.data['externalUrl'];
    return true;
  }
}
