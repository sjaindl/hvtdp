import { Component, OnInit } from '@angular/core';
import { GameSeason } from '../shared/games';
import { Player } from '../shared/player';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';

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

  constructor(private mysqlService: MysqlService) {
   }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getGames().subscribe(seasons => {
      this.seasons = seasons
    })

    this.mysqlService.getPlayers().subscribe(players => {
      this.players = players
    })
  }

  selectSeason(season: GameSeason) {
    this.selectedSeason = season
  }

  back() {
    this.selectedSeason = null
  }
}
