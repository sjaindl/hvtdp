import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Seasons } from '../shared/seasons';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { VideoCardComponent } from '../video-card/video-card.component';

/** TODO(API): advent calendar texts and door metadata are maintained here per season. */
const SEASON_TEXT: Record<string, { title: string; lead: string; note: string }> = {
  '2021': {
    title: 'Sport-Adventkalender',
    lead: 'Premiere! Die Weihnachtszeit ist ja die ruhigste des Jahres – wir nutzen sie, um das Fußballjahr Revue passieren zu lassen: Jeden Tag stellen wir euch einen Spieler aus dem Meisterschaftskader vor.',
    note: '',
  },
  '2023': {
    title: 'Tor-Adventkalender',
    lead: 'Wir lassen das vergangene Fußballjahr mit einer der schönsten Sachen im Fußball Revue passieren: Toren! Mit dem HV TDP „Tor-Adventkalender“ stellen wir euch jeden Tag eines unserer schönsten Tore vor.',
    note: 'Ab Türchen 11 folgen die Tore aus dem Fanvoting zum Tor des Jahres 2023 – in der Reihenfolge des Endergebnisses, bis zum 1. Platz am 24. Dezember.',
  },
};

@Component({
  selector: 'app-advent',
  templateUrl: './advent.component.html',
  standalone: true,
  imports: [RouterModule, PageIntroComponent, VideoCardComponent],
})
export class AdventComponent implements OnInit, OnDestroy {
  readonly seasons = Seasons.advent;
  readonly days = Array.from({ length: 24 }, (_, index) => index + 1);

  season: string;
  openDay: number | null = null;
  private sub: Subscription;

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      this.close();
    });
    this.titleService.setTitle('HV TDP Stainz: Adventkalender');
    this.metaTagService.updateTag({ name: 'description', content: 'Der Online-Adventkalender des HV TDP Stainz.' });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    document.body.classList.remove('overflow-hidden');
  }

  get text() {
    return SEASON_TEXT[this.season] ?? { title: 'Adventkalender', lead: '', note: '' };
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
    return `assets/images/advent/${this.season}/${this.season}_Adventskalender_${day}.jpg`;
  }

  video(day: number): string {
    return `assets/videos/advent/${this.season}/${this.season}_HV TDP Stainz_Adventskalender_${day}.mp4`;
  }

  open(day: number) {
    if (day <= this.openedDoors) {
      this.openDay = day;
      document.body.classList.add('overflow-hidden');
    }
  }

  close() {
    this.openDay = null;
    document.body.classList.remove('overflow-hidden');
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
