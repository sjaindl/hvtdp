import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, map, reduce, shareReplay } from 'rxjs';
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

  /** All entries of a collection type (e.g. `news-items`), loaded once and shared. */
  public getCollection<T>(pluralName: string, params: StrapiParams = {}): Observable<T[]> {
    const key = `${pluralName}?${new HttpParams({ fromObject: params }).toString()}`;
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.getPage<T>(pluralName, params, 1).pipe(
          expand((page) =>
            page.meta.pagination.page < page.meta.pagination.pageCount
              ? this.getPage<T>(pluralName, params, page.meta.pagination.page + 1)
              : EMPTY
          ),
          map((page) => page.data),
          reduce((all, data) => all.concat(data), [] as T[]),
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

  public getNews(): Observable<News[]> {
    return this.getCollection<StrapiNewsItem>('news-items', {
      'sort[0]': 'date:desc',
      'sort[1]': 'newsId:desc',
      'populate[image]': true,
      'populate[homeImage]': true,
      'populate[match][fields][0]': 'round',
    }).pipe(map((items) => items.map((item) => this.toNews(item))));
  }

  /** Resolves CMS-relative paths (e.g. /uploads/x.jpg) against the CMS host. */
  public resolveUrl(url: string): string {
    return resolveCmsUrl(url);
  }

  private getPage<T>(
    pluralName: string,
    params: StrapiParams,
    page: number
  ): Observable<StrapiPage<T>> {
    return this.http.get<StrapiPage<T>>(`${environment.cmsUrl}/api/${pluralName}`, {
      params: { ...params, 'pagination[page]': page, 'pagination[pageSize]': this.pageSize },
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
