import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Chef } from '../shared/chefs';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

const BOARD_ORDER = ['Obmann', 'Kassier', 'Schriftführer', 'Rechnungsprüfer'];

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [PageIntroComponent],
})
export class AboutComponent implements OnInit {
  readonly imageBaseUrl = baseUrlImages;

  readonly facts = [
    { value: '2014', label: 'gegründet in Stainz' },
    { value: 'e. V.', label: 'eingetragener Verein seit 12/2017' },
    { value: '2020', label: 'seit dieser Saison in der STT-Meisterschaft' },
    { value: '30+', label: 'aktive Kicker im Verein' },
  ];

  readonly achievements = [
    { icon: 'emoji_events', title: '3x Meister Süd-Weststeirercup', years: '2015, 2016, 2018' },
    { icon: 'emoji_events', title: '3x Kleinfeldturniersieger Leibnitz', years: '2014, 2015, 2016' },
    { icon: 'emoji_events', title: '3x Kleinfeld-Jux-Turniersieger Freibad Stainz', years: '2016, 2017, 2018' },
    { icon: 'emoji_events', title: '2x Turniersieger des Hobbyhallenmasters in Leibnitz', years: '2015, 2016' },
    { icon: 'emoji_events', title: '2x Volleyball- und Boccia-Eröffnungsturniersieger', years: '2016, 2017' },
    { icon: 'military_tech', title: '1x Vizemeister Süd-Weststeirercup', years: '2017' },
    { icon: 'directions_run', title: '1x Sieger beim „Stainz in Motion AUFLAUF“', years: '2017' },
    { icon: 'emoji_events', title: '1x Turniersieg beim Hallenturnier des SVU St. Stefan', years: '2023' },
    { icon: 'sports_soccer', title: 'Testspielerfolg gegen die Kampfmannschaft des SC Stainz', years: '2015' },
    { icon: 'sports_soccer', title: 'Testspiel gegen den FC Red Bull Salzburg', years: '2017' },
    { icon: 'sports_soccer', title: 'Testspiel gegen FK Austria Wien Allstars', years: '2024' },
    { icon: 'star', title: 'Stammtischcup Finaltag', years: '2018' },
    { icon: 'favorite', title: 'Österreichischer Fan Meister', years: '2021' },
  ];

  readonly teamPhotos = [
    ['2025', '2025_Mannschaft.jpg'],
    ['2024', '2024_Mannschaft.jpg'],
    ['2023', '2023_Mannschaft.jpg'],
    ['2022', '2022_Mannschaft.jpg'],
    ['2021', '2021_Mannschaft.jpg'],
    ['2020', '2020_Mannschaft.jpg'],
    ['2018/19', '2018_2019_Mannschaft.jpg'],
    ['2017/18', '2017_2018_Mannschaft.jpg'],
    ['2016/17', '2016_2017_Mannschaft.jpg'],
    ['2015/16', '2015_2016_Mannschaft.jpg'],
    ['2014', '2014_Mannschaft.jpg'],
  ].map(([season, file]) => ({ season, src: 'assets/images/aboutus/' + file }));

  board: Chef[] = [];

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.mysqlService.getChefs().subscribe((chefs: Chef[]) => {
      const rank = (chef: Chef) => {
        const index = BOARD_ORDER.findIndex((role) => chef.function.includes(role));
        return index === -1 ? BOARD_ORDER.length : index;
      };
      // "Dummy" entries were placeholders to align the old grid layout.
      this.board = chefs.filter((chef) => chef.firstName !== 'Dummy').sort((a, b) => rank(a) - rank(b));
    });

    this.titleService.setTitle('HV TDP Stainz: Über uns');
    this.metaTagService.updateTag({ name: 'description', content: 'Informationen über den HV TDP Stainz' });
  }
}
