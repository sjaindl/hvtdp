import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, map, reduce, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { News } from '../shared/news';

interface StrapiMedia {
  url: string;
}

interface StrapiNewsItem {
  newsId: number;
  date: string;
  title: string;
  content: string | null;
  image: StrapiMedia | null;
  homeImage: StrapiMedia | null;
}

interface StrapiPage<T> {
  data: T[];
  meta: { pagination: { page: number; pageCount: number } };
}

@Injectable({ providedIn: 'root' })
export class CmsService {
  private http = inject(HttpClient);

  // Strapi caps page size at 100, so all news are collected page by page.
  private readonly pageSize = 100;
  private news$?: Observable<News[]>;

  public getNews(): Observable<News[]> {
    this.news$ ??= this.getNewsPage(1).pipe(
      expand((page) =>
        page.meta.pagination.page < page.meta.pagination.pageCount
          ? this.getNewsPage(page.meta.pagination.page + 1)
          : EMPTY
      ),
      map((page) => page.data.map((item) => this.toNews(item))),
      reduce((all, news) => all.concat(news), [] as News[]),
      shareReplay(1)
    );

    return this.news$;
  }

  /** Resolves CMS-relative paths (e.g. /uploads/x.jpg) against the CMS host. */
  public resolveUrl(url: string): string {
    return url.startsWith('/') ? environment.cmsUrl + url : url;
  }

  private getNewsPage(page: number): Observable<StrapiPage<StrapiNewsItem>> {
    const params = new HttpParams()
      .set('sort[0]', 'date:desc')
      .set('sort[1]', 'newsId:desc')
      .set('populate[0]', 'image')
      .set('populate[1]', 'homeImage')
      .set('pagination[page]', page)
      .set('pagination[pageSize]', this.pageSize);

    return this.http.get<StrapiPage<StrapiNewsItem>>(environment.cmsUrl + '/api/news-items', {
      params,
    });
  }

  private toNews(item: StrapiNewsItem): News {
    return {
      newsId: item.newsId,
      newsDate: new Date(item.date),
      title: item.title,
      content: item.content ?? '',
      imageUrl: item.image ? this.resolveUrl(item.image.url) : null,
      homeImageUrl: item.homeImage ? this.resolveUrl(item.homeImage.url) : null,
    };
  }
}
