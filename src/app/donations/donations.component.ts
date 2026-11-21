import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Donation } from '../shared/donations';
import { CLUB_EMAIL } from '../shared/seasons';
import { DateUtil } from '../shared/utils/date.util';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { FittedImageComponent } from '../ui/fitted-image/fitted-image.component';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

interface DonationYear {
  year: string;
  donations: Donation[];
}

const INITIAL_YEARS = 2;

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  standalone: true,
  imports: [EmptyStateComponent, PageIntroComponent, FittedImageComponent, ZoomableDirective],
})
export class DonationsComponent implements OnInit {
  private mysqlService = inject(MysqlService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly imageBaseUrl = baseUrlImages;
  readonly formatDate = DateUtil.formatDate;
  readonly mailUrl = `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent('Matchballspende')}`;

  years: DonationYear[] = [];
  showAll = false;
  loaded = false;
  failed = false;
  errorText = '';

  ngOnInit() {
    this.load();
    this.titleService.setTitle('HV TDP Stainz: Matchballspenden');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Die Matchballspenden und Förderer des HV TDP Stainz.',
    });
  }

  load() {
    this.failed = false;
    this.mysqlService.getDonations().subscribe({
      next: (donations) => {
        const sorted = [...donations].sort((a, b) => String(b.date).localeCompare(String(a.date)));
        const byYear = new Map<string, Donation[]>();
        sorted.forEach((donation) => {
          const year = String(donation.date).slice(0, 4);
          byYear.set(year, [...(byYear.get(year) ?? []), donation]);
        });
        this.years = [...byYear.entries()].map(([year, items]) => ({ year, donations: items }));
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  get visibleYears(): DonationYear[] {
    return this.showAll ? this.years : this.years.slice(0, INITIAL_YEARS);
  }
}
