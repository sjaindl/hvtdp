import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { News } from '../../shared/news';
import { DateUtil } from '../../shared/utils/date.util';
import { FittedImageComponent } from '../fitted-image/fitted-image.component';

/** Design: "Card/NewsRow" – compact list item with thumbnail, full-row tap target. */
@Component({
  selector: 'app-news-row',
  standalone: true,
  imports: [RouterModule, FittedImageComponent],
  host: { class: 'block' },
  template: `
    <a
      [routerLink]="['/news', news.newsId]"
      class="card group flex items-center gap-3.5 p-3 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
    >
      <div class="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
        @if (news.imageUrl) {
          <app-fitted-image [src]="news.imageUrl" alt="" [zoomable]="false"></app-fitted-image>
        } @else {
          <div class="flex h-full items-center justify-center bg-pink-50">
            <img src="hvtdp.png" alt="" class="h-12 opacity-80" />
          </div>
        }
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-xs font-semibold text-pink-600">{{ date }}</span>
        <span class="line-clamp-2 text-base font-bold leading-snug text-gray-900">{{ news.title }}</span>
      </div>
      <span class="material-icons text-gray-400">chevron_right</span>
    </a>
  `,
})
export class NewsRowComponent {
  @Input({ required: true }) news: News;

  get date(): string {
    return DateUtil.formatDate(this.news.newsDate);
  }
}
