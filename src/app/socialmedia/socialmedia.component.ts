import { Component, OnInit } from '@angular/core'
import { GameSeason } from '../shared/games'
import { Player } from '../shared/player'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent implements OnInit {

  seasons: GameSeason[]
  players: Player[]
  selectedSeason: GameSeason = null
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) {
   }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getGames().subscribe(seasons => {
      this.seasons = seasons
    })

    this.mysqlService.getPlayers().subscribe(players => {
      this.players = players
    })

    this.titleService.setTitle("HV TDP Stainz: Videos")
    this.metaTagService.updateTag({
      name: 'description', content: "Videos der Tore vom HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  selectSeason(season: GameSeason) {
    this.selectedSeason = season
  }

  back() {
    this.selectedSeason = null
  }
}
