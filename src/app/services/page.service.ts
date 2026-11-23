import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AdventCalendar,
  GoldenShotPage,
  Hallenturnier,
  HallenturnierRegistration,
} from '../shared/page';
import { MatchUtil } from '../shared/utils/match.util';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { formatPrice } from '../shared/utils/price.util';
import { CmsService } from './cms.service';

interface StrapiHallenturnier {
  title: string;
  lead: string | null;
  image: StrapiMedia | null;
  date: string;
  dateHint: string | null;
  location: string | null;
  format: string | null;
  entryFee: number | null;
  registrationDeadline: string | null;
  registrationOpen: boolean | null;
  prizes: { text: string }[] | null;
  bankRecipient: string | null;
  iban: string | null;
  paymentReference: string | null;
  lastEditionAlbum: { name: string; year: string; slug: string } | null;
}

interface StrapiGoldenShot {
  active: boolean | null;
  title: string;
  sponsor: string | null;
  image: StrapiMedia | null;
  description: string | null;
  finalDate: string | null;
  registrationOpen: boolean | null;
  registrationDeadline: string | null;
  poll: { year: string; open: boolean | null; closesAt: string | null } | null;
  resultImage: StrapiMedia | null;
}

interface StrapiAdventCalendar {
  year: string;
  title: string;
  lead: string | null;
  note: string | null;
  doors: { day: number; poster: StrapiMedia | null; video: StrapiMedia | null }[] | null;
}

/** "2027-01-09" → "Sa, 09.01.2027" (local date, no time-zone shift). */
function formatDay(value: string | null): string {
  const day = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
  return day
    ? MatchUtil.formatDateTime({ kickoff: new Date(+day[1], +day[2] - 1, +day[3]), hasTime: false })
    : '';
}

/** Today as "YYYY-MM-DD" in local time. */
function today(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function toHallenturnier(entry: StrapiHallenturnier, now = new Date()): Hallenturnier {
  const fee = entry.entryFee;
  return {
    title: entry.title,
    lead: entry.lead ?? '',
    imageUrl: mediaUrl(entry.image, 'large'),
    deadline: formatDay(entry.registrationDeadline),
    facts: [
      { icon: 'event', label: 'Wann', value: formatDay(entry.date), hint: entry.dateHint ?? '' },
      { icon: 'location_on', label: 'Wo', value: entry.location ?? '', hint: '' },
      { icon: 'groups', label: 'Spielform', value: entry.format ?? '', hint: '' },
      {
        icon: 'payments',
        label: 'Nenngeld',
        // "70 € pro Team"; cents only when there are some.
        value:
          fee === null ? '' : `${Number.isInteger(fee) ? `${fee} €` : formatPrice(fee)} pro Team`,
        hint: '',
      },
    ].filter((fact) => fact.value),
    prizes: (entry.prizes ?? []).map((prize) => prize.text),
    bank: {
      recipient: entry.bankRecipient ?? '',
      iban: entry.iban ?? '',
      reference: entry.paymentReference ?? '',
    },
    lastEdition: entry.lastEditionAlbum
      ? {
          link: ['/gallery', entry.lastEditionAlbum.year, entry.lastEditionAlbum.slug],
          title: entry.lastEditionAlbum.name,
        }
      : null,
    registrationOpen:
      entry.registrationOpen !== false &&
      (!entry.registrationDeadline || today(now) <= entry.registrationDeadline),
  };
}

export function toGoldenShot(entry: StrapiGoldenShot, now = new Date()): GoldenShotPage {
  const poll = entry.poll;
  const closesAt = poll?.closesAt ? new Date(poll.closesAt) : null;
  return {
    active: entry.active ?? false,
    title: entry.title,
    sponsor: entry.sponsor ?? '',
    imageUrl: mediaUrl(entry.image, 'large'),
    description: entry.description ?? '',
    finalDate: formatDay(entry.finalDate),
    registrationOpen:
      !!entry.active &&
      !!entry.registrationOpen &&
      (!entry.registrationDeadline || today(now) <= entry.registrationDeadline),
    deadline: formatDay(entry.registrationDeadline),
    poll: poll
      ? {
          year: poll.year,
          open: !!poll.open && (!closesAt || closesAt > now),
          // "So, 17.05.2026, 23:55 Uhr"
          closesAt: closesAt
            ? MatchUtil.formatDateTime({ kickoff: closesAt, hasTime: true }).replace(' · ', ', ')
            : '',
        }
      : null,
    resultImageUrl: mediaUrl(entry.resultImage, 'large'),
  };
}

/** Page texts from Strapi: the Hallenturnier page (with its registration) and the Advent calendars. */
@Injectable({ providedIn: 'root' })
export class PageService {
  private cms = inject(CmsService);
  private http = inject(HttpClient);

  getHallenturnier(): Observable<Hallenturnier | null> {
    return this.cms
      .getSingle<StrapiHallenturnier>('hallenturnier', {
        'populate[image]': true,
        'populate[prizes]': true,
        'populate[lastEditionAlbum][fields][0]': 'name',
        'populate[lastEditionAlbum][fields][1]': 'year',
        'populate[lastEditionAlbum][fields][2]': 'slug',
      })
      .pipe(map((entry) => (entry ? toHallenturnier(entry) : null)));
  }

  /** Stores the registration; the server sends the mails to the club and to the registrant. */
  register(registration: HallenturnierRegistration): Observable<unknown> {
    return this.http.post(
      `${environment.cmsUrl}/api/hallenturnier-registrations/register`,
      registration
    );
  }

  getGoldenShot(): Observable<GoldenShotPage | null> {
    return this.cms
      .getSingle<StrapiGoldenShot>('golden-shot', {
        'populate[image]': true,
        'populate[resultImage]': true,
        'populate[poll][fields][0]': 'year',
        'populate[poll][fields][1]': 'open',
        'populate[poll][fields][2]': 'closesAt',
      })
      .pipe(map((entry) => (entry ? toGoldenShot(entry) : null)));
  }

  /** Multipart registration (fields + optional photo); the server adds the participant to the voting and sends the mails. */
  registerGoldenShot(registration: FormData): Observable<unknown> {
    return this.http.post(
      `${environment.cmsUrl}/api/golden-shot-registrations/register`,
      registration
    );
  }

  /** Years with an Advent calendar, newest first. */
  getAdventYears(): Observable<string[]> {
    return this.cms
      .getCollection<Pick<StrapiAdventCalendar, 'year'>>('advent-calendars', {
        'fields[0]': 'year',
        'sort[0]': 'year:desc',
      })
      .pipe(map((calendars) => calendars.map((calendar) => calendar.year)));
  }

  getAdventCalendar(year: string): Observable<AdventCalendar | null> {
    return this.cms
      .getCollection<StrapiAdventCalendar>('advent-calendars', {
        'filters[year][$eq]': year,
        'populate[doors][populate][poster]': true,
        'populate[doors][populate][video]': true,
      })
      .pipe(
        map(([calendar]) =>
          calendar
            ? {
                year: calendar.year,
                title: calendar.title,
                lead: calendar.lead ?? '',
                note: calendar.note ?? '',
                doors: (calendar.doors ?? []).map((door) => ({
                  day: door.day,
                  posterUrl: mediaUrl(door.poster, 'small') ?? '',
                  videoUrl: mediaUrl(door.video) ?? '',
                })),
              }
            : null
        )
      );
  }
}
