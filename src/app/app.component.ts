import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      // if (event instanceof NavigationEnd) {
      //   ga('set', 'page', event.urlAfterRedirects);
      //   ga('send', 'pageview');
      // }
    });
  }
}


// https://unyscape.com/how-to-implement-google-analytics-in-an-angular2-app/
