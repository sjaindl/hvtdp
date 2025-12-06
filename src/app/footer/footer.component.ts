import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatisticsService } from '../services/statistics.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule]
})
export class FooterComponent implements OnInit {
  sessions: String = null;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.statisticsService.getVisitorCount().subscribe((sessions) => {
      this.sessions = sessions;
    });
  }
}
