import { Component, OnInit } from '@angular/core';
import { PLAYERS, Player } from '../shared/player';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  players: Player[];

  constructor() {

   }

  ngOnInit() {
    this.players = PLAYERS
  }

}
