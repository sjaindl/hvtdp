import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Game } from '../shared/games';
import { Player } from '../shared/player';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css'],
})
export class SocialmediaComponent implements OnInit {
  games: Game[];
  season: string;
  players: Player[];
  imageBaseUrl: String;
  isMobile = null;

  private sub: any;

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages;

    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];

      this.mysqlService.getGames().subscribe((games) => {
        this.games = games
          .filter((game) => {
            return game.season == this.season;
          })
          .sort((a, b) => {
            return b.round - a.round;
          });
      });

      this.mysqlService.getPlayers().subscribe((players) => {
        this.players = players;
      });
    });

    this.titleService.setTitle('HV TDP Stainz: Videos');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Videos von Veranstaltungen und Toren vom HV TDP Stainz.',
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

  height() {
    if (this.isMobile) return '600px';
    return '400px';
  }

  matches(name: string, player: Player) {
    if (name.includes(' ')) {
      return player.lastName + ' ' + player.firstName == name;
    }

    return player.lastName == name;
  }
}
