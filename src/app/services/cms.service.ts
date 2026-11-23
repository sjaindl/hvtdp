import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { News, NewsCategory } from '../shared/news';
import { StrapiMedia, mediaUrl, resolveCmsUrl } from '../shared/utils/media.util';

interface StrapiNewsItem {
  newsId: number;
  date: string;
  title: string;
  content: string | null;
  image: StrapiMedia | null;
  homeImage: StrapiMedia | null;
  category: NewsCategory | null;
  match: { id: number } | null;
}

interface StrapiPage<T> {
  data: T[];
  meta: { pagination: { page: number; pageCount: number } };
}

/** Query parameters in Strapi's bracket syntax, e.g. `{ 'sort[0]': 'date:desc', 'populate[0]': 'image' }`. */
export type StrapiParams = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class CmsService {
  private http = inject(HttpClient);

  // Strapi caps page size at 100, so collections are collected page by page.
  private readonly pageSize = 100;
  private readonly cache = new Map<string, Observable<unknown>>();

  /**
   * All entries of a collection type (e.g. `news-items`), loaded once and shared. After the first
   * page the remaining pages are requested in parallel. A failed load is not kept: shareReplay
   * resets on error, so the next subscriber (e.g. "Erneut") requests again.
   */
  public getCollection<T>(pluralName: string, params: StrapiParams = {}): Observable<T[]> {
    const key = `${pluralName}?${new HttpParams({ fromObject: params }).toString()}`;
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.getPage<T>(pluralName, params, 1, this.pageSize).pipe(
          switchMap((first) => {
            const { pageCount } = first.meta.pagination;
            const rest = Array.from({ length: pageCount - 1 }, (_, index) =>
              this.getPage<T>(pluralName, params, index + 2, this.pageSize)
            );
            return rest.length
              ? forkJoin(rest).pipe(map((pages) => [first, ...pages]))
              : of([first]);
          }),
          map((pages) => pages.flatMap((page) => page.data)),
          shareReplay(1)
        )
      );
    }
    return this.cache.get(key) as Observable<T[]>;
  }

  /** The first `limit` entries of a collection type (use with a sort), loaded once and shared. */
  public getFirst<T>(
    pluralName: string,
    limit: number,
    params: StrapiParams = {}
  ): Observable<T[]> {
    const key = `${pluralName}?limit=${limit}&${new HttpParams({ fromObject: params }).toString()}`;
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.getPage<T>(pluralName, params, 1, limit).pipe(
          map((page) => page.data),
          shareReplay(1)
        )
      );
    }
    return this.cache.get(key) as Observable<T[]>;
  }

  /** A single type (e.g. `announcement`), or null when it has not been created yet. */
  public getSingle<T>(singularName: string, params: StrapiParams = {}): Observable<T | null> {
    const key = `${singularName}?${new HttpParams({ fromObject: params }).toString()}`;
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.http
          .get<{ data: T | null }>(`${environment.cmsUrl}/api/${singularName}`, { params })
          .pipe(
            map((response) => response.data),
            shareReplay(1)
          )
      );
    }
    return this.cache.get(key) as Observable<T | null>;
  }

  /** All news, newest first; with `limit` only the newest ones (home page). */
  public getNews(limit?: number): Observable<News[]> {
    const params: StrapiParams = {
      'sort[0]': 'date:desc',
      'sort[1]': 'newsId:desc',
      'populate[image]': true,
      'populate[homeImage]': true,
      'populate[match][fields][0]': 'round',
    };
    const items = limit
      ? this.getFirst<StrapiNewsItem>('news-items', limit, params)
      : this.getCollection<StrapiNewsItem>('news-items', params);
    return items.pipe(map((list) => list.map((item) => this.toNews(item))));
  }

  /** News id of the newest report of a match, or null without report. */
  public getMatchReport(matchId: number): Observable<number | null> {
    return this.getFirst<{ newsId: number }>('news-items', 1, {
      'filters[match][id][$eq]': matchId,
      'sort[0]': 'date:desc',
      'sort[1]': 'newsId:desc',
      'fields[0]': 'newsId',
    }).pipe(map(([report]) => report?.newsId ?? null));
  }

  /** Resolves CMS-relative paths (e.g. /uploads/x.jpg) against the CMS host. */
  public resolveUrl(url: string): string {
    return resolveCmsUrl(url);
  }

  private getPage<T>(
    pluralName: string,
    params: StrapiParams,
    page: number,
    pageSize: number
  ): Observable<StrapiPage<T>> {
    return this.http.get<StrapiPage<T>>(`${environment.cmsUrl}/api/${pluralName}`, {
      params: { ...params, 'pagination[page]': page, 'pagination[pageSize]': pageSize },
    });
  }

  private toNews(item: StrapiNewsItem): News {
    return {
      newsId: item.newsId,
      newsDate: new Date(item.date),
      title: item.title,
      content: item.content ?? '',
      imageUrl: mediaUrl(item.image),
      homeImageUrl: mediaUrl(item.homeImage),
      category: item.category ?? null,
      matchId: item.match?.id ?? null,
    };
  }
}
