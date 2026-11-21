import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
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

  constructor() {
    // Start every page at the top (hash routing keeps the scroll position otherwise).
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo({ top: 0 });
    });
  }
}
