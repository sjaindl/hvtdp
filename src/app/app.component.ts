import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
})
export class AppComponent {
  constructor(public router: Router) {
    this.router.events.subscribe((event) => {
      // if (event instanceof NavigationEnd) {
      //   ga('set', 'page', event.urlAfterRedirects);
      //   ga('send', 'pageview');
      // }
    });
  }
}

// https://unyscape.com/how-to-implement-google-analytics-in-an-angular2-app/
