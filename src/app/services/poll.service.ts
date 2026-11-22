import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Poll, PollOption, PollType } from '../shared/poll';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { CmsService } from './cms.service';
import { MATCH_POPULATE, StrapiMatch, toMatchInfo } from './championship.service';
import { StrapiVideo, toVideo } from './video.service';

interface StrapiPoll {
  type: PollType;
  year: string;
  open: boolean | null;
  surveyUrl: string | null;
}

interface StrapiPollOption {
  documentId: string;
  name: string | null;
  player: {
    firstName: string;
    lastName: string;
    position: string | null;
    image: StrapiMedia | null;
  } | null;
  video: (StrapiVideo & { match: StrapiMatch | null }) | null;
}

/** The match populate params for a nested relation ("populate[season]…" → "<prefix>[populate][season]…"). */
const nested = (prefix: string) =>
  Object.fromEntries(
    Object.entries(MATCH_POPULATE).map(([key, value]) => [
      key.replace(/^populate/, `${prefix}[populate]`),
      value,
    ])
  );

/** Tor des Jahres / Spieler der Saison votings from Strapi. Vote counts are private there. */
@Injectable({ providedIn: 'root' })
export class PollService {
  private cms = inject(CmsService);
  private http = inject(HttpClient);

  /** Polls of a type, newest year first. */
  getPolls(type: PollType): Observable<Poll[]> {
    return this.cms
      .getCollection<StrapiPoll>('polls', { 'filters[type][$eq]': type, 'sort[0]': 'year:desc' })
      .pipe(
        map((polls) =>
          polls.map((poll) => ({
            type: poll.type,
            year: poll.year,
            open: poll.open ?? false,
            surveyUrl: poll.surveyUrl,
          }))
        )
      );
  }

  /** Options of a poll; goals with their video and match, players with their portrait. */
  getOptions(type: PollType, year: string): Observable<PollOption[]> {
    return this.cms
      .getCollection<StrapiPollOption>('poll-options', {
        'filters[poll][type][$eq]': type,
        'filters[poll][year][$eq]': year,
        'populate[player][fields][0]': 'firstName',
        'populate[player][fields][1]': 'lastName',
        'populate[player][fields][2]': 'position',
        'populate[player][populate][image]': true,
        'populate[video][populate][player][fields][0]': 'firstName',
        'populate[video][populate][player][fields][1]': 'lastName',
        ...nested('populate[video][populate][match]'),
      })
      .pipe(
        map((options) =>
          options.map((option) => ({
            documentId: option.documentId,
            name: option.player
              ? `${option.player.firstName} ${option.player.lastName}`
              : (option.name ?? ''),
            imageUrl: mediaUrl(option.player?.image, 'thumbnail'),
            position: option.player?.position ?? null,
            video: option.video ? toVideo(option.video) : null,
            match: option.video?.match ? toMatchInfo(option.video.match) : null,
          }))
        )
      );
  }

  /** Counts one vote; the server answers 409 for closed polls and 429 for too many votes. */
  vote(option: PollOption): Observable<unknown> {
    return this.http.post(`${environment.cmsUrl}/api/poll-options/${option.documentId}/vote`, {});
  }
}
