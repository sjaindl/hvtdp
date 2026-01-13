import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { MatchInfo } from '../shared/match-info';
import { Scorer } from '../shared/scorer';
import { Standing } from '../shared/standing';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule],
})
export class ChampionshipComponent implements OnInit {
  dataSource: MatTableDataSource<Standing> = new MatTableDataSource<Standing>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns = [
    'place',
    'team',
    'games',
    'wins',
    'draws',
    'losses',
    'goalDifference',
    'points',
  ];

  scorers: Scorer[];
  matchInfo: MatchInfo[] = [];
  private matchInfoBySeason = new Map<string, MatchInfo[]>();
  seasonContent: SeasonContent;

  season: string;

  private sub: any;
  expandedStanding: Standing | null = null;
  isMobile = false;

  // tableLink = "https://www.meinspielplan.de/plan/3hjrgw?box=table&title=yes#https%3A%2F%2Fsued-weststeirischercup.jimdo.com%2Fspielbetrieb%2F";

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.updateIsMobile();

    if (this.route.params == null) {
      return;
    }

    this.sub = this.route.params.subscribe((params) => {
      this.season = params['season'];
      console.log(' season: ' + this.season);
      this.seasonContent = this.getSeasonContent(this.season);

      this.mysqlService.getStandings().subscribe((standings) => {
        this.dataSource.data = standings.filter((standing) => {
          return standing.season == this.season;
        });

        this.dataSource.sort = this.sort;
      });

      this.mysqlService.getScorers().subscribe((scorers) => {
        this.scorers = scorers
          .filter((scorer) => {
            return scorer.goals > 0 && scorer.season == this.season;
          })
          .sort((a, b) => {
            if (a.goals == b.goals) {
              if (a.playerName > b.playerName) return 1;
              else return -1;
            }

            return b.goals - a.goals;
          });

        this.scorers.forEach((scorer) => {
          scorer.goalsDisplay = '';
          for (var _i = 0; _i < scorer.goals; _i++) {
            scorer.goalsDisplay += '⚽';
          }
        });
      });

      this.mysqlService.getMatchInfo().subscribe((matches) => {
        this.matchInfo = matches ?? [];
        this.matchInfoBySeason.clear();
        console.log(this.matchInfo);
        this.matchInfo.forEach((match) => {
          const seasonMatches = this.matchInfoBySeason.get(match.season) ?? [];
          seasonMatches.push(match);
          this.matchInfoBySeason.set(match.season, seasonMatches);
          console.log(this.matchInfoBySeason);
        });
      });
    });

    this.titleService.setTitle('HV TDP Stainz: Meisterschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Informationen über die Situation in der Meisterschaft vom HV TDP Stainz in der STT Meisterschaft.',
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

  ngOnChanges() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get mobileStandings(): Standing[] {
    const data = [...this.dataSource.data];
    return this.sort ? this.dataSource.sortData(data, this.sort) : data;
  }

  getMatchesForSeason(season: string): MatchInfo[] {
    const matches = this.matchInfoBySeason.get(season) ?? [];
    return [...matches].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  getResultsForSeason(season: string): MatchInfo[] {
    return this.getMatchesForSeason(season).filter((match) => this.hasScore(match));
  }

  getUpcomingForSeason(season: string): MatchInfo[] {
    return this.getMatchesForSeason(season).filter((match) => !this.hasScore(match));
  }

  formatMatch(match: MatchInfo): string {
    const parts: string[] = [];

    if (match.matchInfo) {
      parts.push(match.matchInfo);
    }
    if (match.dateTime) {
      parts.push(match.dateTime);
    }
    if (match.venue) {
      parts.push(match.venue);
    }

    const teams = [match.homeTeam, match.awayTeam].filter(Boolean).join(' : ');
    if (teams) {
      if (this.hasScore(match)) {
        parts.push(`${teams} ${match.homeScore}:${match.awayScore}`);
      } else {
        parts.push(teams);
      }
    }

    const additional = (match.additionalInfo ?? '').trim();
    if (additional) {
      if (additional === '*') {
        parts.push(additional);
      } else if (additional.startsWith('(')) {
        parts.push(additional);
      } else {
        parts.push(`(${additional})`);
      }
    }

    return parts.join(' - ');
  }

  private hasScore(match: MatchInfo): boolean {
    return (
      match.homeScore !== null &&
      match.homeScore !== undefined &&
      match.awayScore !== null &&
      match.awayScore !== undefined
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.updateIsMobile();
  }

  private updateIsMobile() {
    if (typeof window === 'undefined') return;
    this.isMobile = window.innerWidth <= 768;
  }

  private getSeasonContent(season: string): SeasonContent {
    const content: Record<string, SeasonContent> = {
      '2025-2026': {
        upcomingTitle: 'Spieltermine Herbst 2025',
      },
      '2022-2023': {
        postResults: [
          '* Spiel wird offiziell nicht gewertet, da Gössnitz aus der Liga ausgestiegen ist.',
        ],
      },
      '2021-2022': {
        preface: [
          'Die Plätze 1 bis 3 spielen am Ende der Saison in einem Play-off gegen die Plätze 5 bis 8 aus Liga A um den Aufstieg.',
        ],
      },
    };

    return {
      ...content[season],
    };
  }
}

interface SeasonContent {
  upcomingTitle?: string;
  preface?: string[];
  postResults?: string[];
}
