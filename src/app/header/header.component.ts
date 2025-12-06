import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule]
})
export class HeaderComponent {
  width = '0px';

  navChanged(opened: boolean) {
    this.width = opened ? '100%' : '0px';
  }
}
