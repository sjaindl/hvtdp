import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatisticsService } from '../services/statistics.service';
import { CLUB_NAV, PARTNERS, SOCIAL_LINKS } from '../shared/navigation';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class FooterComponent implements OnInit {
  private statisticsService = inject(StatisticsService);

  readonly socialLinks = SOCIAL_LINKS;
  readonly partners = PARTNERS;
  readonly clubLinks = CLUB_NAV.filter((item) =>
    ['/about', '/membership', '/fanshop', '/contact'].includes(item.path)
  );

  sessions: string = null;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.statisticsService.getVisitorCount().subscribe((sessions) => {
      this.sessions = sessions;
    });
  }
}
