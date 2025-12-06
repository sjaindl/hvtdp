import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Game, Link, GameLinkFlat } from '../shared/games';
import { Player } from '../shared/player';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GoalOfTheSeason } from '../shared/goaloftheseason';
import { CookieService } from 'ngx-cookie-service';

const GOAL_OF_SEASON_VOTING_COOKIE_KEY = 'goal_of_season_voted';

@Component({
    selector: 'app-goaloftheseason',
    templateUrl: './goaloftheseason.component.html',
    styleUrls: ['./goaloftheseason.component.css'],
    standalone: false
})
export class GoalOfTheSeasonComponent implements OnInit {
  games: Game[];
  links: GameLinkFlat[] = [];
  season: string;
  players: Player[];
  imageBaseUrl: String;
  isMobile = null;
  canVote = false;
  goalOfSeasonOptions: GoalOfTheSeason[];

  private sub: any;

  constructor(
    private cookieService: CookieService,
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    //this.canVote = !this.cookieService.check(GOAL_OF_SEASON_VOTING_COOKIE_KEY);
    this.imageBaseUrl = baseUrlImages;

    this.checkDevice();

    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];

      this.mysqlService.getGames().subscribe((games) => {
        this.links = [];

        games.forEach((game) => {
          var links = game.links.filter((link) => link.goalOfSeasonCandidate == 1);
          console.log(links.length);
          links.forEach((link) => {
            if (game.date.startsWith(this.season)) {
              let flat = new GameLinkFlat(
                game.season,
                game.round,
                game.description,
                game.date,
                link,
                game.customText
              );
              console.log(flat);
              this.links.push(flat);
            }
          });

          return game.season == this.season && links.length > 0;
        });
      });

      this.mysqlService.getPlayers().subscribe((players) => {
        this.players = players;
      });

      this.mysqlService.getGoalOfTheSeason().subscribe((options) => {
        this.goalOfSeasonOptions = options
          .filter((a) => {
            return a.season === this.season;
          })
          .sort((first, second) => {
            const firstPlayerLastName = first.player.split(' ')[1];
            const secondPlayerLastName = second.player.split(' ')[1];

            if (firstPlayerLastName > secondPlayerLastName) {
              return 1;
            } else if (firstPlayerLastName < secondPlayerLastName) {
              return -1;
            } else {
              if (first.player > second.player) {
                return 1;
              } else if (first.player < second.player) {
                return -1;
              } else {
                return 0;
              }
            }
          });
      });
    });

    this.titleService.setTitle('HV TDP Stainz: Tor der Saison');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Wähle das Tor der Saison vom HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice();
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }

  matches(name: string, player: Player) {
    if (name.includes(' ')) {
      return player.lastName + ' ' + player.firstName == name;
    }

    return player.lastName == name;
  }

  reload() {
    window.location.reload();
  }

  saveVote(vote: GoalOfTheSeason) {
    this.mysqlService.postGoalOfTheSeasonVote(vote.season, vote.player).subscribe((result) => {
      console.log('posted vote', JSON.stringify(vote), vote.player, vote.season);
      this.cookieService.set(GOAL_OF_SEASON_VOTING_COOKIE_KEY, 'true', 1 / 24); // (peristent) cookie expires after 1 hour
      console.log(`response from server: ${JSON.stringify(result)}`);
      this.canVote = false;
    });
  }
}
