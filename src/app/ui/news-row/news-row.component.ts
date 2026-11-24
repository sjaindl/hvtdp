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
  templateUrl: './news-row.component.html',
})
export class NewsRowComponent {
  @Input({ required: true }) news!: News;

  get date(): string {
    return DateUtil.formatDate(this.news.newsDate);
  }
}
