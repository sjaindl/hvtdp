import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Chef } from '../shared/chefs';
import { Donation } from '../shared/donations';
import { Member, MemberType } from '../shared/member';
import { PappFan } from '../shared/papp';
import { Player, PlayerStatus } from '../shared/player';
import { TeamPage } from '../shared/team-page';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { CmsService } from './cms.service';

interface StrapiPlayer {
  firstName: string;
  lastName: string;
  position: string | null;
  status: PlayerStatus;
  memberSinceYear: number | null;
  games: number | null;
  goals: number | null;
  jerseyNumber: number | null;
  image: StrapiMedia | null;
}

interface StrapiBoardMember {
  function: string;
  firstName: string;
  lastName: string;
  image: StrapiMedia | null;
}

interface StrapiPappFan {
  name: string;
  image: StrapiMedia | null;
}

interface StrapiDonation {
  donator: string;
  date: string;
  game: string | null;
  description: string | null;
  image: StrapiMedia | null;
  matchBallImage: StrapiMedia | null;
}

/** Portraits are shown as cards (and full screen), so the medium size (1000px) is enough. */
const PORTRAIT = 'medium';

/** Club data from Strapi: players, board, members, Papp-Fans and match ball donations. */
@Injectable({ providedIn: 'root' })
export class ClubService {
  private cms = inject(CmsService);

  /** All players (or only those with the given status), sorted by last name. */
  getPlayers(status?: PlayerStatus): Observable<Player[]> {
    return this.cms
      .getCollection<StrapiPlayer>('players', {
        'sort[0]': 'lastName:asc',
        'sort[1]': 'firstName:asc',
        'populate[0]': 'image',
      })
      .pipe(
        map((players) =>
          players
            .filter((player) => !status || player.status === status)
            .map((player) => ({
              firstName: player.firstName,
              lastName: player.lastName,
              position: player.position ?? '',
              status: player.status,
              memberSinceYear: player.memberSinceYear,
              games: player.games ?? 0,
              goals: player.goals ?? 0,
              jerseyNumber: player.jerseyNumber,
              imageUrl: mediaUrl(player.image, PORTRAIT),
            }))
        )
      );
  }

  getTeamPage(): Observable<TeamPage | null> {
    return this.cms.getSingle<TeamPage>('team-page');
  }

  getBoard(): Observable<Chef[]> {
    return this.cms
      .getCollection<StrapiBoardMember>('board-members', {
        'sort[0]': 'order:asc',
        'populate[0]': 'image',
      })
      .pipe(
        map((board) =>
          board.map((chef) => ({
            function: chef.function,
            firstName: chef.firstName,
            lastName: chef.lastName,
            imageUrl: mediaUrl(chef.image, PORTRAIT),
          }))
        )
      );
  }

  getMembers(type: MemberType): Observable<Member[]> {
    return this.cms
      .getCollection<Member>('members', {
        'filters[type][$eq]': type,
        'sort[0]': 'lastName:asc',
        'sort[1]': 'firstName:asc',
      })
      .pipe(
        map((members) =>
          members.map(({ firstName, lastName, since }) => ({ firstName, lastName, type, since }))
        )
      );
  }

  getPappFans(): Observable<PappFan[]> {
    return this.cms
      .getCollection<StrapiPappFan>('papp-fans', { 'sort[0]': 'order:asc', 'populate[0]': 'image' })
      .pipe(
        map((fans) =>
          fans.map((fan) => ({ name: fan.name, imageUrl: mediaUrl(fan.image, PORTRAIT) }))
        )
      );
  }

  /** Newest first. */
  getDonations(): Observable<Donation[]> {
    return this.cms
      .getCollection<StrapiDonation>('donations', {
        'sort[0]': 'date:desc',
        'populate[0]': 'image',
        'populate[1]': 'matchBallImage',
      })
      .pipe(
        map((donations) =>
          donations.map((donation) => ({
            donator: donation.donator,
            date: donation.date,
            game: donation.game ?? '',
            description: donation.description ?? '',
            imageUrl: mediaUrl(donation.image, 'medium'),
            matchBallImageUrl: mediaUrl(donation.matchBallImage, 'thumbnail'),
          }))
        )
      );
  }
}
