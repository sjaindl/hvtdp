import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatisticsService } from '../services/statistics.service';
import { CLUB_NAV, PARTNERS, SOCIAL_LINKS } from '../shared/navigation';
import { CookieConsentService } from '../ui/cookie-banner/cookie-consent.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class FooterComponent implements OnInit {
  private statisticsService = inject(StatisticsService);
  readonly cookieConsent = inject(CookieConsentService);

  readonly socialLinks = SOCIAL_LINKS;
  readonly partners = PARTNERS;
  readonly clubLinks = CLUB_NAV.filter((item) =>
    ['/about', '/membership', '/fanshop', '/contact'].includes(item.path)
  );

  sessions: string | null = null;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.statisticsService.getVisitorCount().subscribe((sessions) => {
      this.sessions = sessions;
    });
  }
}
