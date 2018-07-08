import { Component, OnInit } from '@angular/core';
import { PLAYERS, Player } from '../shared/player';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  
  teamPositionSortOrder = new Map<string, number>();

  players: Player[];

  constructor() {
    this.teamPositionSortOrder.set("Tormann", 1);
    this.teamPositionSortOrder.set("Verteidiger", 2);
    this.teamPositionSortOrder.set("Mittelfeld", 3);
    this.teamPositionSortOrder.set("Stürmer", 4);
  }

  ngOnInit() {
    //players should first be sorted by position, then by last name
    this.players = PLAYERS.sort((a, b) => {
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
  }
}
