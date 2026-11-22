import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatchVideos, Video } from '../shared/video';
import { MatchUtil } from '../shared/utils/match.util';
import { CmsService } from './cms.service';
import { MATCH_POPULATE, StrapiMatch, toMatchInfo } from './championship.service';

export interface StrapiVideo {
  documentId: string;
  url: string;
  description: string | null;
  name: string | null;
  order: number | null;
  player: { firstName: string; lastName: string } | null;
}

/** Scorer of a video: the linked player, else the fallback name (e.g. "Eigentor"). */
export function toVideo(video: StrapiVideo): Video {
  return {
    url: video.url,
    description: video.description,
    scorer: video.player ? `${video.player.firstName} ${video.player.lastName}` : video.name,
  };
}

/** Goal and highlight videos from Strapi; they belong to a match (or an event). */
@Injectable({ providedIn: 'root' })
export class VideoService {
  private cms = inject(CmsService);

  /** All matches and events with videos, newest first. */
  getMatchVideos(): Observable<MatchVideos[]> {
    return this.cms
      .getCollection<StrapiMatch & { videos: StrapiVideo[] }>('matches', {
        ...MATCH_POPULATE,
        'filters[videos][id][$notNull]': true,
        'populate[videos][sort][0]': 'order:asc',
        'populate[videos][populate][player][fields][0]': 'firstName',
        'populate[videos][populate][player][fields][1]': 'lastName',
      })
      .pipe(
        map((matches) =>
          matches
            .map((match) => ({ match: toMatchInfo(match), videos: match.videos.map(toVideo) }))
            .sort((a, b) => MatchUtil.compareNewestFirst(a.match, b.match))
        )
      );
  }
}
