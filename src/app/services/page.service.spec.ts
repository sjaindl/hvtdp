import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { AdventCalendar } from '../shared/page';
import { PageService, toClubEvent, toGoldenShot, toHallenturnier } from './page.service';

describe('PageService', () => {
  const api = `${environment.cmsUrl}/api`;
  const entry = {
    title: '17. Stainzer Hallenturnier 2027',
    lead: 'Anmelden und mitspielen!',
    image: { url: '/uploads/h.jpg', formats: null },
    date: '2027-01-09',
    dateHint: 'Erweiterung auf Fr, 08.01. möglich',
    location: 'Mittelschule Stainz',
    format: '3 + 1',
    entryFee: 70,
    registrationDeadline: '2027-01-05',
    registrationOpen: true,
    prizes: [{ text: 'Pokal' }],
    bankRecipient: 'HV TDP Stainz',
    iban: 'AT67 3843 9000 0481 3481',
    paymentReference: 'Hallenturnier 2027 + Mannschaftsname',
    lastEditionAlbum: {
      name: '16. Stainzer Hallenturnier',
      year: '2026',
      slug: '16-stainzer-hallenturnier',
    },
  };

  describe('toHallenturnier', () => {
    it('formats the facts like the page showed them', () => {
      const tournament = toHallenturnier(entry, new Date(2026, 10, 23));
      expect(tournament.deadline).toBe('Di, 05.01.2027');
      expect(tournament.facts.map((fact) => fact.value)).toEqual([
        'Sa, 09.01.2027',
        'Mittelschule Stainz',
        '3 + 1',
        '70 € pro Team',
      ]);
      expect(tournament.facts[0].hint).toBe('Erweiterung auf Fr, 08.01. möglich');
      expect(tournament.lastEdition).toEqual({
        link: ['/gallery', '2026', '16-stainzer-hallenturnier'],
        title: '16. Stainzer Hallenturnier',
      });
      expect(tournament.registrationOpen).toBeTrue();
    });

    it('shows cents only when the fee has some and leaves out empty facts', () => {
      const tournament = toHallenturnier(
        { ...entry, entryFee: 72.5, format: null },
        new Date(2026, 10, 23)
      );
      expect(tournament.facts.map((fact) => fact.label)).toEqual(['Wann', 'Wo', 'Nenngeld']);
      expect(tournament.facts[2].value).toBe('72,50 € pro Team');
    });

    it('closes the registration after the deadline day or when switched off', () => {
      expect(toHallenturnier(entry, new Date(2027, 0, 5, 23, 0)).registrationOpen).toBeTrue();
      expect(toHallenturnier(entry, new Date(2027, 0, 6)).registrationOpen).toBeFalse();
      expect(
        toHallenturnier({ ...entry, registrationOpen: false }, new Date(2026, 10, 23))
          .registrationOpen
      ).toBeFalse();
      expect(
        toHallenturnier({ ...entry, registrationDeadline: null }, new Date(2030, 0, 1))
          .registrationOpen
      ).toBeTrue();
    });
  });

  describe('toGoldenShot', () => {
    const page = {
      active: true,
      title: 'Torschuss Challenge 2027',
      sponsor: 'powered by 11teamsports Graz',
      image: null,
      description: '### Preise',
      finalDate: '2027-06-05',
      registrationOpen: true,
      registrationDeadline: '2027-04-30',
      poll: { year: '2027', open: true, closesAt: '2027-05-16T21:55:00.000Z' },
      resultImage: null,
    };

    it('opens registration and voting by switch, deadline and voting end', () => {
      const before = toGoldenShot(page, new Date(2027, 3, 1));
      expect(before.registrationOpen).toBeTrue();
      expect(before.poll?.open).toBeTrue();
      expect(before.finalDate).toBe('Sa, 05.06.2027');

      const after = toGoldenShot(page, new Date(2027, 4, 20));
      expect(after.registrationOpen).toBeFalse();
      expect(after.poll?.open).toBeFalse();
    });

    it('keeps everything closed while the page is inactive', () => {
      expect(
        toGoldenShot({ ...page, active: false }, new Date(2027, 3, 1)).registrationOpen
      ).toBeFalse();
    });
  });

  describe('toClubEvent', () => {
    const ducks = {
      slug: 'entenrennen',
      active: true,
      title: '3. Entenrennen Stainz 2025',
      lead: null,
      image: null,
      description: null,
      date: '2025-09-20',
      startTime: '17:30:00.000',
      location: 'Stainz',
      format: null,
      formType: 'order' as const,
      price: 3,
      orderUnit: 'Ente',
      orderUnitPlural: 'Enten',
      phoneRequired: false,
      registrationOpen: true,
      registrationDeadline: '2025-09-19',
      bankRecipient: 'HV TDP Stainz',
      iban: 'AT67',
      bic: 'RZSTAT2G439',
      paymentReference: 'Entenrennen 2025 + Name',
    };

    it('builds the facts and the order details', () => {
      const event = toClubEvent(ducks, new Date(2025, 8, 1));
      expect(event.facts.map((fact) => fact.value)).toEqual([
        'Sa, 20.09.2025, 17:30 Uhr',
        'Stainz',
        '3 € pro Ente',
      ]);
      expect(event.units).toBe('Enten');
      expect(event.phoneRequired).toBeTrue();
      expect(event.bank?.reference).toBe('Entenrennen 2025 + Name');
      expect(event.registrationOpen).toBeTrue();
    });

    it('team events show the fee per team, free events no bank data, and close after the deadline', () => {
      const team = toClubEvent(
        { ...ducks, formType: 'team', price: 20, format: '2er Teams' },
        new Date(2025, 8, 20)
      );
      expect(team.facts.map((fact) => fact.value)).toContain('20 € pro Team');
      expect(team.registrationOpen).toBeFalse();
      expect(toClubEvent({ ...ducks, formType: 'team', price: null }).bank).toBeNull();
    });
  });

  describe('requests', () => {
    let service: PageService;
    let http: HttpTestingController;
    const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: provideTestDependencies() });
      service = TestBed.inject(PageService);
      http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('posts the registration including the honeypot field', () => {
      service
        .register({
          name: 'Max Muster',
          email: 'max@example.com',
          teamName: 'Die Hallenhelden',
          website: '',
        })
        .subscribe();
      const request = http.expectOne(`${api}/hallenturnier-registrations/register`);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({
        name: 'Max Muster',
        email: 'max@example.com',
        teamName: 'Die Hallenhelden',
        website: '',
      });
      request.flush({ ok: true });
    });

    it('maps the doors of an Advent calendar to poster and video URLs', () => {
      let calendar: AdventCalendar | null = null;
      service.getAdventCalendar('2023').subscribe((result) => (calendar = result));
      http
        .expectOne((r) => r.url === `${api}/advent-calendars`)
        .flush(
          page([
            {
              year: '2023',
              title: 'Tor-Adventkalender',
              lead: 'Tore!',
              note: null,
              doors: [
                {
                  day: 1,
                  poster: {
                    url: '/uploads/p1.jpg',
                    formats: { small: { url: '/uploads/small_p1.jpg', width: 500, height: 500 } },
                  },
                  video: { url: '/uploads/v1.mp4' },
                },
              ],
            },
          ])
        );
      expect(calendar!.note).toBe('');
      expect(calendar!.doors).toEqual([
        {
          day: 1,
          posterUrl: `${environment.cmsUrl}/uploads/small_p1.jpg`,
          videoUrl: `${environment.cmsUrl}/uploads/v1.mp4`,
        },
      ]);
    });
  });
});
