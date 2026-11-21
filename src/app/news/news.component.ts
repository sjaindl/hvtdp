import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Marked } from 'marked';
import { Subscription } from 'rxjs';
import { CmsService } from '../services/cms.service';
import { News } from '../shared/news';
import { DateUtil } from '../shared/utils/date.util';
import { TextUtil } from '../shared/utils/text.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { NewsCardComponent } from '../ui/news-card/news-card.component';
import { NewsRowComponent } from '../ui/news-row/news-row.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ToastService } from '../ui/toast/toast.service';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  standalone: true,
  imports: [RouterModule, EmptyStateComponent, NewsCardComponent, NewsRowComponent, PageIntroComponent],
})
export class NewsComponent implements OnInit, OnDestroy {
  news: News[] = [];
  loaded = false;
  failed = false;

  /** Year filter. TODO(API): replace with news categories (Spielbericht, Vereinsleben, …) once the CMS has them. */
  years: string[] = [];
  selectedYear: string | null = null;
  visibleCount = PAGE_SIZE;

  newsId: number | null = null;
  selectedNews: News | null = null;
  selectedHtml = '';

  private sub: Subscription;

  private readonly markdown = new Marked({
    breaks: true,
    gfm: true,
    walkTokens: (token) => {
      // Images and media links live on the CMS; other relative links point to this site.
      const isMedia =
        token.type === 'image' || (token.type === 'link' && token.href.startsWith('/uploads/'));
      if (isMedia) {
        token.href = this.cmsService.resolveUrl(token.href);
      }
    },
    renderer: {
      // External links open in a new tab; links within the site (e.g. /#/news/12) stay in it.
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const escapeAttr = (value: string) =>
          value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
        const external =
          /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?hvtdpstainz\.at/.test(href);
        const targetAttr = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeAttr(href)}"${titleAttr}${targetAttr}>${text}</a>`;
      },
    },
  });

  constructor(
    private cmsService: CmsService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta,
    private toastService: ToastService
  ) {}

  formatDate = DateUtil.formatDate;

  ngOnInit() {
    this.load();
    this.metaTagService.updateTag({ name: 'description', content: 'Die aktuellsten News über den HV TDP Stainz' });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  load() {
    this.failed = false;
    this.cmsService.getNews().subscribe({
      next: (news) => {
        this.news = news;
        this.years = [...new Set(news.map((item) => String(item.newsDate.getFullYear())))];
        this.loaded = true;
        this.sub?.unsubscribe();
        this.sub = this.route.params.subscribe((params) => this.selectNews(params['newsId']));
      },
      error: () => {
        this.loaded = true;
        this.failed = true;
      },
    });
  }

  get filteredNews(): News[] {
    return this.selectedYear
      ? this.news.filter((item) => String(item.newsDate.getFullYear()) === this.selectedYear)
      : this.news;
  }

  get visibleNews(): News[] {
    return this.filteredNews.slice(0, this.visibleCount);
  }

  get relatedNews(): News[] {
    return this.news.filter((item) => item.newsId !== this.selectedNews?.newsId).slice(0, 3);
  }

  selectYear(year: string | null) {
    this.selectedYear = year;
    this.visibleCount = PAGE_SIZE;
  }

  showMore() {
    this.visibleCount += PAGE_SIZE;
  }

  get readingMinutes(): number {
    return TextUtil.readingMinutes(this.selectedNews?.content ?? '');
  }

  get weekdayDate(): string {
    const date = this.selectedNews?.newsDate;
    if (!date) {
      return '';
    }
    return `${date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}, ${DateUtil.formatDate(date)}`;
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      this.toastService.show('Link kopiert');
    } catch {
      this.toastService.show('Link konnte nicht kopiert werden', 'error');
    }
  }

  get whatsappUrl(): string {
    return 'https://wa.me/?text=' + encodeURIComponent(`${this.selectedNews?.title} ${location.href}`);
  }

  get facebookUrl(): string {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href);
  }

  private selectNews(newsIdParam: string | undefined) {
    this.newsId = newsIdParam ? +newsIdParam : null;
    this.selectedNews = this.newsId ? (this.news.find((item) => item.newsId === this.newsId) ?? null) : null;

    if (this.selectedNews) {
      // Rendered HTML is bound via [innerHTML], so Angular's sanitizer cleans it.
      this.selectedHtml = this.markdown.parse(this.stripLeadingHeading(this.selectedNews.content), {
        async: false,
      });
      this.titleService.setTitle(`HV TDP Stainz: ${this.selectedNews.title}`);
    } else {
      this.titleService.setTitle('HV TDP Stainz: News');
    }
  }

  /** The page shows the CMS title already, so a leading "# Title" in the body would duplicate it. */
  private stripLeadingHeading(markdown: string): string {
    return (markdown ?? '').replace(/^\s*#\s[^\n]*\n+/, '');
  }
}
