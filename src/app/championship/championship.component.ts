import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { Scorer } from '../shared/scorer';
import { Standing } from '../shared/standing';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.css'],
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

  @HostListener('window:resize')
  onResize() {
    this.updateIsMobile();
  }

  private updateIsMobile() {
    if (typeof window === 'undefined') return;
    this.isMobile = window.innerWidth <= 768;
  }
}
