import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { cookieConsentConfig } from './shared/cookieconsent.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
})
export class AppComponent implements OnInit {
  constructor(public router: Router) {
    this.router.events.subscribe((event) => {
      // if (event instanceof NavigationEnd) {
      //   ga('set', 'page', event.urlAfterRedirects);
      //   ga('send', 'pageview');
      // }
    });
  }

  ngOnInit(): void {
    this.initCookieConsent();
  }

  private initCookieConsent(): void {
    const cc: any = (window as any).cookieconsent;
    if (!cc || typeof cc.initialise !== 'function') {
      return;
    }
    cc.initialise(cookieConsentConfig);
  }
}

// https://unyscape.com/how-to-implement-google-analytics-in-an-angular2-app/
