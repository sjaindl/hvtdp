import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section class="page-container flex flex-col items-center gap-4 py-14 text-center lg:gap-5 lg:py-24">
      <span class="flex h-24 w-24 items-center justify-center rounded-full bg-pink-50 lg:h-[120px] lg:w-[120px]">
        <span class="material-icons text-5xl text-pink-600 lg:text-6xl">sports_soccer</span>
      </span>
      <p class="text-7xl font-extrabold leading-none text-pink-600 lg:text-8xl">404</p>
      <h1 class="text-[26px] font-extrabold text-gray-900 lg:text-[32px]">Abseits!</h1>
      <p class="max-w-lg text-base leading-relaxed text-gray-600 lg:text-lg">
        Diese Seite gibt es leider nicht (mehr). Vielleicht hat sich der Link geändert – probier es über die
        Startseite.
      </p>
      <div class="flex w-full flex-col gap-2.5 pt-2 sm:w-auto sm:flex-row">
        <a routerLink="/home" class="btn-primary">Zur Startseite <span class="material-icons text-xl">home</span></a>
        <a routerLink="/news" class="btn-secondary">Neueste Nachrichten</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Seite nicht gefunden');
  }
}
