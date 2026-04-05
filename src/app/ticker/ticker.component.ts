import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ticker',
    templateUrl: './ticker.component.html',
    styleUrls: ['./ticker.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class TickerComponent {
  @Input() text: string = '';
}
