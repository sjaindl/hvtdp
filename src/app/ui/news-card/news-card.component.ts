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
  templateUrl: './news-card.component.html',
})
export class NewsCardComponent {
  @Input({ required: true }) news!: News;
  @Input() showExcerpt = true;

  get date(): string {
    return DateUtil.formatDate(this.news.newsDate);
  }

  get excerpt(): string {
    return TextUtil.excerpt(this.news.content);
  }
}
