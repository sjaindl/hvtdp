import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { Member } from '../shared/member';
import { TeamComponent } from '../team/team.component';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = (data: unknown[]) => ({ data, meta: { pagination: { page: 1, pageCount: 1 } } });
  const photo = (name: string) => ({
    url: `/uploads/${name}.jpg`,
    formats: { medium: { url: `/uploads/medium_${name}.jpg`, width: 1000, height: 1200 } },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(ClubService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const players = [
    {
      firstName: 'Daniel',
      lastName: 'Fabian',
      position: 'Stürmer',
      squad: 'Kader',
      memberSinceYear: 2014,
      games: 120,
      goals: 170,
      image: photo('fabian'),
    },
    {
      firstName: 'Bernhard',
      lastName: 'Reinisch',
      position: 'Mittelfeld',
      squad: 'Aktiv',
      memberSinceYear: 2019,
      games: null,
      goals: null,
      image: null,
    },
    {
      firstName: 'Max',
      lastName: 'Ehemaliger',
      position: null,
      squad: 'Ehemalig',
      memberSinceYear: null,
      games: 3,
      goals: 0,
      image: null,
    },
  ];

  it('maps players with their portrait in medium size', () => {
    let result: { lastName: string; imageUrl: string | null; games: number; position: string }[] =
      [];
    service.getPlayers().subscribe((list) => (result = list));
    const request = http.expectOne((r) => r.url === `${api}/players`);
    expect(request.request.params.get('populate[0]')).toBe('image');
    request.flush(page(players));

    expect(result.map((player) => player.lastName)).toEqual(['Fabian', 'Reinisch', 'Ehemaliger']);
    expect(result[0].imageUrl).toBe(`${environment.cmsUrl}/uploads/medium_fabian.jpg`);
    expect(result[1].imageUrl).toBeNull();
    expect(result[1].games).toBe(0);
    expect(result[2].position).toBe('');
  });

  it('filters players by squad status', () => {
    let squad: string[] = [];
    let active: string[] = [];
    service
      .getPlayers('Kader')
      .subscribe((list) => (squad = list.map((player) => player.lastName)));
    service
      .getPlayers('Aktiv')
      .subscribe((list) => (active = list.map((player) => player.lastName)));
    // Both use the same cached request.
    http.expectOne((r) => r.url === `${api}/players`).flush(page(players));
    expect(squad).toEqual(['Fabian']);
    expect(active).toEqual(['Reinisch']);
  });

  it('loads members of one type', () => {
    let members: Member[] = [];
    service.getMembers('Fördernd').subscribe((list) => (members = list));
    const request = http.expectOne((r) => r.url === `${api}/members`);
    expect(request.request.params.get('filters[type][$eq]')).toBe('Fördernd');
    request.flush(page([{ firstName: 'Simon', lastName: 'Lazarus' }]));
    expect(members).toEqual([{ firstName: 'Simon', lastName: 'Lazarus', type: 'Fördernd' }]);
  });

  it('maps donations with photo and ball image', () => {
    let donation:
      | {
          date: string;
          imageUrl: string | null;
          matchBallImageUrl: string | null;
          description: string;
        }
      | undefined;
    service.getDonations().subscribe((list) => (donation = list[0]));
    http
      .expectOne((r) => r.url === `${api}/donations`)
      .flush(
        page([
          {
            donator: 'Granit',
            date: '2024-06-18',
            game: 'HV TDP – St. Johann',
            description: null,
            image: photo('granit'),
            matchBallImage: { url: '/uploads/ball.gif' },
          },
        ])
      );
    expect(donation?.date).toBe('2024-06-18');
    expect(donation?.description).toBe('');
    expect(donation?.imageUrl).toBe(`${environment.cmsUrl}/uploads/medium_granit.jpg`);
    expect(donation?.matchBallImageUrl).toBe(`${environment.cmsUrl}/uploads/ball.gif`);
  });

  it('formats the squad list date as "Stand MM/YYYY"', () => {
    expect(TeamComponent.formatAsOf('2025-12-01')).toBe('Stand 12/2025');
    expect(TeamComponent.formatAsOf(null)).toBe('');
  });
});
