import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { PassworddialogComponent } from '../passworddialog/passworddialog.component';
import { MysqlService } from '../services/mysql.service';
import { baseUrlDocuments } from '../shared/baseurls';
import { HvtdpDocument } from '../shared/document';
import { DateUtil } from '../shared/utils/date.util';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ToastService } from '../ui/toast/toast.service';

interface DocumentItem {
  document: HvtdpDocument;
  title: string;
  date: string;
  locked: boolean;
}

interface DocumentGroup {
  title: string;
  items: DocumentItem[];
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  standalone: true,
  imports: [MatDialogModule, EmptyStateComponent, PageIntroComponent],
})
export class DocumentsComponent implements OnInit {
  private mysqlService = inject(MysqlService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  readonly documentBaseUrl = baseUrlDocuments;

  groups: DocumentGroup[] = [];
  loaded = false;
  failed = false;
  errorText = '';

  ngOnInit() {
    this.load();
    this.titleService.setTitle('HV TDP Stainz: Dokumente');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Dokumente rund um den HV TDP Stainz für Mitglieder und Fans: Download.',
    });
  }

  load() {
    this.failed = false;
    this.mysqlService.getDocuments().subscribe({
      next: (documents) => {
        this.groups = this.group(documents.map((document) => this.toItem(document)));
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  open(item: DocumentItem) {
    if (!item.locked) {
      window.open(this.documentBaseUrl + item.document.link, '_blank', 'noopener');
      return;
    }
    this.dialog
      .open(PassworddialogComponent, { panelClass: 'hv-dialog' })
      .afterClosed()
      .subscribe((password) => {
        if (password === undefined) {
          return;
        }
        this.mysqlService.checkPassword(password).subscribe({
          next: (result) => {
            if (result.length != 1 || !result[0].valid) {
              this.toastService.show('Passwort ungültig', 'error');
            } else {
              window.location.href = this.documentBaseUrl + item.document.link;
            }
          },
          error: (error: unknown) =>
            this.toastService.showError('Passwort konnte nicht geprüft werden', error),
        });
      });
  }

  /** Descriptions look like "2018-01-30, Sitzungsprotokoll"; the date prefix is optional. */
  private toItem(document: HvtdpDocument): DocumentItem {
    const match = document.description.match(/^(\d{4}-\d{2}-\d{2}),\s*(.*)$/);
    return {
      document,
      title: match ? match[2] : document.description,
      date: match ? DateUtil.formatDate(match[1]) : '',
      locked: document.protected !== '0',
    };
  }

  /** TODO(API): documents have no category; they are grouped by keywords in the title for now. */
  private group(items: DocumentItem[]): DocumentGroup[] {
    const byDateDesc = (a: DocumentItem, b: DocumentItem) =>
      b.document.description.localeCompare(a.document.description);
    const results = items.filter((item) => /Endergebnis/i.test(item.title)).sort(byDateDesc);
    const minutes = items
      .filter((item) => /Protokoll|Stellungnahme/i.test(item.title))
      .sort(byDateDesc);
    const general = items.filter((item) => !results.includes(item) && !minutes.includes(item));
    return [
      { title: 'Für Mitglieder & Fans', items: general },
      { title: 'Turnierergebnisse', items: results },
      { title: 'Protokolle & Vereinsdokumente', items: minutes },
    ].filter((group) => group.items.length);
  }
}
