import { Component, OnInit } from '@angular/core';
import { GameSeason, GAMES } from '../shared/games';
import { Player, PLAYERS } from '../shared/player';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent implements OnInit {

  seasons: GameSeason[]
  players: Player[]
  selectedSeason: GameSeason = null

  constructor() {
    this.players = PLAYERS
    this.seasons = GAMES.sort((a, b) => {

      if (a.season < b.season) {
        return 1;
      } 
      else if (a.season > b.season) {
        return -1;
      }
      else {
          return 0;
      }
    });
   }

  ngOnInit() {
  }

  selectSeason(season: GameSeason) {
    this.selectedSeason = season
  }

  back() {
    this.selectedSeason = null
  }

}
