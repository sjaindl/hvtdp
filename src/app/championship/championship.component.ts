import { Component, OnInit, ViewChild } from '@angular/core';
import { MysqlService } from '../services/mysql.service'
import { Title, Meta } from '@angular/platform-browser';
import { Standing } from '../shared/standing';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Player } from '../shared/player';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.css']
})
export class ChampionshipComponent implements OnInit {

  dataSource: MatTableDataSource<Standing> = new MatTableDataSource<Standing>()
  @ViewChild(MatSort, { static: false }) sort: MatSort

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms
    this.setDataSourceAttributes()
  }

  setDataSourceAttributes() {
    this.dataSource.sort = this.sort
  }

  displayedColumns = ["place", "team", "games", "wins", "draws", "losses", "goalDifference", "points"]

  players: Player[]

  // numSequence(n: Player): Array<number> {
  //   console.log(n.goals)
  //   return Array(n.goals + 1)
  // }

  // tableLink = "https://www.meinspielplan.de/plan/3hjrgw?box=table&title=yes#https%3A%2F%2Fsued-weststeirischercup.jimdo.com%2Fspielbetrieb%2F";

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.mysqlService.getStandings().subscribe( standings => {
      this.dataSource.data = standings
      this.dataSource.sort = this.sort
    })

    this.mysqlService.getPlayers().subscribe( players => {
      this.players = players.filter((player) => {
        return player.goals > 0
      }).sort((a, b) => {
        if (a.goals < b.goals) {
          return 1
        } else if (a.goals > b.goals) {
          return -1
        } else {
          return 0
        }
      })

      this.players.forEach((player) => {
        player.goalsDisplay = ""
        for (var _i = 0; _i < player.goals; _i++) {
          player.goalsDisplay += "⚽"
        }
      })
    })

    this.titleService.setTitle("HV TDP Stainz: Meisterschaft")
    this.metaTagService.updateTag({
      name: 'description', content: "Informationen über die Situation in der Meisterschaft vom HV TDP Stainz in der STT Meisterschaft."
    })
  }

  ngOnChanges() {
    this.dataSource.sort = this.sort
  }
}
