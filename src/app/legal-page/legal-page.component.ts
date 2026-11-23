import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Marked } from 'marked';
import { PageService } from '../services/page.service';
import { LegalPage } from '../shared/page';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';

/** Placeholders like [[ZVR-Zahl]] stay visible until they are replaced in the admin. */
const PLACEHOLDER = /\[\[([^\]]+)\]\]/g;
const PLACEHOLDER_HTML =
  '<mark class="rounded bg-amber-100 px-1 font-semibold text-amber-900" title="Noch zu ergänzen">$1</mark>';

/** Impressum and Datenschutzerklärung (`legal-page` in Strapi); the route passes the slug. */
@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.component.html',
  standalone: true,
  imports: [EmptyStateComponent],
})
export class LegalPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private pageService = inject(PageService);

  private readonly markdown = new Marked({ breaks: true, gfm: true });

  page: LegalPage | null = null;
  html = '';
  /** True while the text still contains placeholders. */
  incomplete = false;
  loaded = false;
  failed = false;
  errorText = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.failed = false;
    this.pageService.getLegalPage(this.route.snapshot.data['slug'] ?? '').subscribe({
      next: (page) => {
        this.page = page;
        this.incomplete = !!page && PLACEHOLDER.test(page.content);
        PLACEHOLDER.lastIndex = 0;
        this.html = page
          ? (this.markdown.parse(page.content) as string).replace(PLACEHOLDER, PLACEHOLDER_HTML)
          : '';
        this.loaded = true;
        if (page) {
          this.titleService.setTitle(`HV TDP Stainz: ${page.title}`);
          this.metaTagService.updateTag({
            name: 'description',
            content: `${page.title} des HV TDP Stainz`,
          });
        }
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }
}
