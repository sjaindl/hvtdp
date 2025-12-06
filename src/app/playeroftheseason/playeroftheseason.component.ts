import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Player } from '../shared/player';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PlayerOfTheSeason } from '../shared/playeroftheseason';

const PLAYER_OF_SEASON_VOTING_COOKIE_KEY = 'player_of_season_voted';

@Component({
  selector: 'app-playeroftheseason',
  templateUrl: './playeroftheseason.component.html',
  styleUrls: ['./playeroftheseason.component.css'],
})
export class PlayerOfTheSeasonComponent implements OnInit {
  season: string;
  players: Player[];
  imageBaseUrl: String;
  isMobile = null;
  canVote = false;
  playerOfSeasonOptions: PlayerOfTheSeason[];

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
    //this.canVote = !this.cookieService.check(PLAYER_OF_SEASON_VOTING_COOKIE_KEY);
    this.imageBaseUrl = baseUrlImages;

    this.checkDevice();

    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];

      this.mysqlService.getPlayers().subscribe((players) => {
        this.players = players;
      });

      this.mysqlService.getPlayerOfTheSeason().subscribe((options) => {
        this.playerOfSeasonOptions = options
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

    this.titleService.setTitle('HV TDP Stainz: Spieler der Saison');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Wähle den Spieler der Saison vom HV TDP Stainz.',
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
    if (player === undefined) return false;

    const toMatch = player.firstName + ' ' + player.lastName;
    return toMatch === name;
  }

  reload() {
    window.location.reload();
  }

  saveVote(vote: PlayerOfTheSeason) {
    this.mysqlService.postPlayerOfTheSeasonVote(vote.season, vote.player).subscribe((result) => {
      console.log('posted vote', JSON.stringify(vote), vote.player, vote.season);
      this.cookieService.set(PLAYER_OF_SEASON_VOTING_COOKIE_KEY, 'true', 1 / 24); // (peristent) cookie expires after 1 hour
      console.log(`response from server: ${JSON.stringify(result)}`);
      this.canVote = false;
    });
  }
}
