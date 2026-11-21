import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { News } from '../../shared/news';
import { DateUtil } from '../../shared/utils/date.util';
import { TextUtil } from '../../shared/utils/text.util';
import { FittedImageComponent } from '../fitted-image/fitted-image.component';

/** Design: "Card/News" – image, category badge, date, title, teaser and "Weiterlesen". */
@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterModule, FittedImageComponent],
  host: { class: 'block' },
  template: `
    <a [routerLink]="['/news', news.newsId]" class="card-interactive group flex h-full flex-col">
      <div class="aspect-video overflow-hidden bg-gray-100">
        @if (news.imageUrl) {
          <app-fitted-image [src]="news.imageUrl" [alt]="news.title" [zoomable]="false"></app-fitted-image>
        } @else {
          <div class="flex h-full items-center justify-center bg-pink-50">
            <img src="hvtdp.png" alt="" class="h-20 opacity-80" />
          </div>
        }
      </div>
      <div class="flex flex-1 flex-col gap-2.5 px-5 pb-6 pt-5">
        <div class="flex items-center gap-2.5">
          <!-- TODO(API): news items have no category yet; show it here once the CMS provides one. -->
          <span class="badge-pink">News</span>
          <span class="text-[13px] font-medium text-gray-500">{{ date }}</span>
        </div>
        <h3 class="text-xl font-bold leading-snug text-gray-900">{{ news.title }}</h3>
        @if (showExcerpt) {
          <p class="line-clamp-3 text-[15px] leading-relaxed text-gray-600">{{ excerpt }}</p>
        }
        <span class="mt-auto inline-flex items-center gap-1 pt-2 text-[15px] font-semibold text-pink-600">
          Weiterlesen <span class="material-icons text-lg">arrow_forward</span>
        </span>
      </div>
    </a>
  `,
})
export class NewsCardComponent {
  @Input({ required: true }) news: News;
  @Input() showExcerpt = true;

  get date(): string {
    return DateUtil.formatDate(this.news.newsDate);
  }

  get excerpt(): string {
    return TextUtil.excerpt(this.news.content);
  }
}
