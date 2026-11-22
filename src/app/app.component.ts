import { Component, inject } from '@angular/core';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { leafRoute } from './app-routing/route-transitions';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CookieBannerComponent } from './ui/cookie-banner/cookie-banner.component';
import { ImageViewerHostComponent } from './ui/image-viewer/image-viewer-host.component';
import { ToastHostComponent } from './ui/toast/toast-host.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    CookieBannerComponent,
    ImageViewerHostComponent,
    ToastHostComponent,
  ],
})
export class AppComponent {
  router = inject(Router);

  private lastPage: Route | null = null;

  constructor() {
    // Start every new page at the top (hash routing keeps the scroll position otherwise). Switching only
    // parameters on the same page, e.g. another season, keeps the position.
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const page = leafRoute(this.router.routerState.snapshot.root).routeConfig;
      if (page !== this.lastPage) {
        window.scrollTo({ top: 0 });
      }
      this.lastPage = page;
    });
  }
}
