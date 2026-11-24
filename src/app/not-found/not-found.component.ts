import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  private titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Seite nicht gefunden');
  }
}
