import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Competition, MatchInfo } from '../shared/match-info';
import { Scorer } from '../shared/scorer';
import { Season } from '../shared/season';
import { Standing } from '../shared/standing';
import { MatchUtil } from '../shared/utils/match.util';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { CmsService, StrapiParams } from './cms.service';

interface StrapiSeason {
  key: string;
  league: string | null;
  preface: string | null;
  postResults: string | null;
}

interface StrapiStanding extends Omit<Standing, 'place'> {
  place: number;
}

interface StrapiScorer {
  name: string | null;
  goals: number;
  player: { firstName: string; lastName: string; image: StrapiMedia | null } | null;
}

export interface StrapiMatch {
  id: number;
  season: { key: string } | null;
  competition: Competition;
  round: number | null;
  stage: string | null;
  title: string | null;
  date: string | null;
  /** "15:30:00.000" */
  time: string | null;
  venue: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  homeScore: number | null;
  awayScore: number | null;
  additionalInfo: string | null;
  goals?:
    | {
        name: string | null;
        count: number;
        player: { firstName: string; lastName: string } | null;
      }[]
    | null;
}

/** Local date/time without time-zone conversion: "2026-09-19" + "15:30:00.000" → Date. */
function toKickoff(date: string | null, time: string | null): Date | null {
  const day = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? '');
  if (!day) {
    return null;
  }
  const clock = /^(\d{2}):(\d{2})/.exec(time ?? '');
  return new Date(+day[1], +day[2] - 1, +day[3], clock ? +clock[1] : 0, clock ? +clock[2] : 0);
}

/** Populates the season key and the goal scorers' names of a match. */
export const MATCH_POPULATE: StrapiParams = {
  'populate[season][fields][0]': 'key',
  'populate[goals][populate][player][fields][0]': 'firstName',
  'populate[goals][populate][player][fields][1]': 'lastName',
};

export function toMatchInfo(match: StrapiMatch): MatchInfo {
  return {
    id: match.id,
    season: match.season?.key ?? '',
    competition: match.competition,
    round: match.round,
    stage: match.stage,
    title: match.title,
    label: MatchUtil.label(match),
    kickoff: toKickoff(match.date, match.time),
    hasTime: !!match.time,
    venue: match.venue,
    homeTeam: match.homeTeam ?? '',
    awayTeam: match.awayTeam ?? '',
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    additionalInfo: match.additionalInfo,
    // The scorer text shows last names, as the club writes them ("Paschek (2), Jaindl").
    goals: (match.goals ?? []).map((goal) => ({
      name: goal.player?.lastName ?? goal.name ?? '',
      count: goal.count,
    })),
  };
}

/** Championship data from Strapi: seasons, standings, season scorers and matches. */
@Injectable({ providedIn: 'root' })
export class ChampionshipService {
  private cms = inject(CmsService);

  /** Newest season first; `withStandings` leaves out seasons without a table (e.g. older video seasons). */
  getSeasons(withStandings = false): Observable<Season[]> {
    const params: StrapiParams = { 'sort[0]': 'key:desc' };
    if (withStandings) {
      params['filters[standings][id][$notNull]'] = true;
    }
    return this.cms.getCollection<StrapiSeason>('seasons', params).pipe(
      map((seasons) =>
        seasons.map((season) => ({
          key: season.key,
          league: season.league ?? '',
          preface: season.preface ?? '',
          postResults: season.postResults ?? '',
        }))
      )
    );
  }

  getStandings(season: string): Observable<Standing[]> {
    return this.cms
      .getCollection<StrapiStanding>('standings', {
        'filters[season][key][$eq]': season,
        'sort[0]': 'place:asc',
      })
      .pipe(
        map((rows) =>
          rows.map(
            ({ place, team, games, wins, draws, losses, goalsFor, goalsAgainst, points }) => ({
              place,
              team,
              games,
              wins,
              draws,
              losses,
              goalsFor,
              goalsAgainst,
              points,
            })
          )
        )
      );
  }

  /** Scorers with at least one goal, most goals first. */
  getScorers(season: string): Observable<Scorer[]> {
    return this.cms
      .getCollection<StrapiScorer>('scorers', {
        'filters[season][key][$eq]': season,
        'filters[goals][$gt]': 0,
        'populate[player][fields][0]': 'firstName',
        'populate[player][fields][1]': 'lastName',
        'populate[player][populate][image]': true,
      })
      .pipe(
        map((scorers) =>
          scorers
            .map((scorer) => ({
              name: scorer.player
                ? `${scorer.player.firstName} ${scorer.player.lastName}`
                : (scorer.name ?? ''),
              goals: scorer.goals,
              imageUrl: mediaUrl(scorer.player?.image, 'thumbnail'),
            }))
            .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name, 'de-DE'))
        )
      );
  }

  /** Matches of one season, or all matches (home widgets) without a season; events are left out. */
  getMatches(season?: string): Observable<MatchInfo[]> {
    const params: StrapiParams = { ...MATCH_POPULATE, 'filters[competition][$ne]': 'Event' };
    if (season) {
      params['filters[season][key][$eq]'] = season;
    }
    return this.cms
      .getCollection<StrapiMatch>('matches', params)
      .pipe(map((matches) => matches.map(toMatchInfo)));
  }
}
