import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, combineLatest, of, switchMap } from 'rxjs';
import { PageService } from '../services/page.service';
import { AdventCalendar } from '../shared/page';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ScrollLockService } from '../ui/scroll-lock/scroll-lock.service';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-advent',
  templateUrl: './advent.component.html',
  standalone: true,
  imports: [
    RouterModule,
    PageIntroComponent,
    VideoCardComponent,
    SlidingIndicatorDirective,
    ContentSwapDirective,
  ],
})
export class AdventComponent implements OnInit, OnDestroy {
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private route = inject(ActivatedRoute);
  private pageService = inject(PageService);
  private scrollLock = inject(ScrollLockService);

  readonly days = Array.from({ length: 24 }, (_, index) => index + 1);

  /** Years with a calendar, newest first. */
  seasons: string[] = [];
  season = '';
  calendar: AdventCalendar | null = null;
  openDay: number | null = null;
  private sub?: Subscription;

  ngOnInit() {
    // Without a year in the URL (/advent) the newest calendar is shown.
    this.sub = combineLatest([this.route.params, this.pageService.getAdventYears()])
      .pipe(
        switchMap(([params, years]) => {
          this.seasons = years;
          this.season = params['season'] ?? years[0] ?? '';
          this.close();
          return this.season ? this.pageService.getAdventCalendar(this.season) : of(null);
        })
      )
      .subscribe({
        next: (calendar) => (this.calendar = calendar),
        error: () => (this.calendar = null),
      });
    this.titleService.setTitle('HV TDP Stainz: Adventkalender');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Der Online-Adventkalender des HV TDP Stainz.',
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.scrollLock.unlock(this);
  }

  get text() {
    return this.calendar ?? { title: 'Adventkalender', lead: '', note: '' };
  }

  /** Doors open on their day in December of the season year; past calendars are fully open. */
  get openedDoors(): number {
    const now = new Date();
    const year = Number(this.season);
    if (now.getFullYear() < year || (now.getFullYear() === year && now.getMonth() < 11)) {
      return 0;
    }
    if (now.getFullYear() === year && now.getMonth() === 11) {
      return Math.min(now.getDate(), 24);
    }
    return 24;
  }

  poster(day: number): string {
    return this.door(day)?.posterUrl ?? '';
  }

  video(day: number): string {
    return this.door(day)?.videoUrl ?? '';
  }

  private door(day: number) {
    return this.calendar?.doors.find((door) => door.day === day);
  }

  open(day: number) {
    if (day <= this.openedDoors) {
      this.openDay = day;
      this.scrollLock.lock(this);
    }
  }

  close() {
    this.openDay = null;
    this.scrollLock.unlock(this);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
