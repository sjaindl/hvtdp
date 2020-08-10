import { Component, OnInit } from '@angular/core'
import { Player } from '../shared/player'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  
  teamPositionSortOrder = new Map<string, number>()

  squadPlayers: Player[]
  activePlayers: Player[]
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) {
    this.teamPositionSortOrder.set("Tormann", 1)
    this.teamPositionSortOrder.set("Verteidiger", 2)
    this.teamPositionSortOrder.set("Mittelfeld", 3)
    this.teamPositionSortOrder.set("Stürmer", 4)
  }
  
  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getSquadPlayers().subscribe( players => {
      //players should first be sorted by position, then by last name
      this.squadPlayers = players.sort((a, b) => {
        var aPositionSortOrder = this.teamPositionSortOrder.get(a.position)
        var bPositionSortOrder = this.teamPositionSortOrder.get(b.position)
  
        if (aPositionSortOrder < bPositionSortOrder) {
          return -1;
        } 
        else if (aPositionSortOrder > bPositionSortOrder) {
          return 1;
        }
        else {
          if (a.lastName < b.lastName) {
            return -1;
          } 
          else if (a.lastName > b.lastName) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    })

    this.mysqlService.getActivePlayers().subscribe( players => {
      //players should first be sorted by position, then by last name
      this.activePlayers = players.sort((a, b) => {
        var aPositionSortOrder = this.teamPositionSortOrder.get(a.position)
        var bPositionSortOrder = this.teamPositionSortOrder.get(b.position)
  
        if (aPositionSortOrder < bPositionSortOrder) {
          return -1;
        } 
        else if (aPositionSortOrder > bPositionSortOrder) {
          return 1;
        }
        else {
          if (a.lastName < b.lastName) {
            return -1;
          } 
          else if (a.lastName > b.lastName) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    })

    this.titleService.setTitle("HV TDP Stainz: Unsere Mannschaft")
    this.metaTagService.updateTag({
      name: 'description', content: "Information über die Spieler im Kader des HV TDP Stainz."
    })
  }
}
