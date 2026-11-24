import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ClubService } from '../services/club.service';
import { PappFan } from '../shared/papp';
import { TextUtil } from '../shared/utils/text.util';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

@Component({
  selector: 'app-hallofpapp',
  templateUrl: './hallofpapp.component.html',
  standalone: true,
  imports: [PageIntroComponent, ZoomableDirective],
})
export class HallofpappComponent implements OnInit {
  private clubService = inject(ClubService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly titleCase = TextUtil.titleCase;
  pappfans: PappFan[] = [];

  ngOnInit() {
    this.clubService.getPappFans().subscribe((fans) => (this.pappfans = fans));
    this.titleService.setTitle('HV TDP Stainz: Papp-Fans');
    this.metaTagService.updateTag({ name: 'description', content: 'Papp-Fans des HV TDP Stainz.' });
  }
}
