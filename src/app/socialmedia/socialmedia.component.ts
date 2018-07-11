import { Component, OnInit } from '@angular/core';
import { Season, SEASONS } from '../shared/games';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent implements OnInit {

  seasons: Season[]
  selectedSeason: Season = null

  constructor() {
    this.seasons = SEASONS.sort((a, b) => {

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

  selectSeason(season: Season) {
    this.selectedSeason = season
  }

  back() {
    this.selectedSeason = null
  }

}
