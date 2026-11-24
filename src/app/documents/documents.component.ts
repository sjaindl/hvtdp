import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { PassworddialogComponent } from '../passworddialog/passworddialog.component';
import { DocumentService } from '../services/document.service';
import { DocumentCategory, HvtdpDocument } from '../shared/document';
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

/** Group headings in display order. */
const GROUPS: { category: DocumentCategory; title: string }[] = [
  { category: 'Allgemein', title: 'Für Mitglieder & Fans' },
  { category: 'Turnierergebnisse', title: 'Turnierergebnisse' },
  { category: 'Protokolle', title: 'Protokolle & Vereinsdokumente' },
];

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
  private documentService = inject(DocumentService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

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
    this.documentService.getDocuments().subscribe({
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
    const { document } = item;
    if (!item.locked && document.url) {
      window.open(document.url, '_blank', 'noopener');
      return;
    }
    this.dialog
      .open(PassworddialogComponent, { panelClass: 'hv-dialog' })
      .afterClosed()
      .subscribe((password) => {
        if (password === undefined) {
          return;
        }
        // The server checks the password and only then sends the PDF.
        this.documentService.download(document, password).subscribe({
          next: (blob) => {
            this.documentService.save(blob, `${document.title}.pdf`);
            this.toastService.show('Dokument wird heruntergeladen');
          },
          error: (error: unknown) => {
            const status = error instanceof HttpErrorResponse ? error.status : 0;
            if (status === 401) {
              this.toastService.show('Passwort ungültig', 'error');
            } else if (status === 429) {
              this.toastService.show(
                'Zu viele Versuche – bitte in 15 Minuten erneut versuchen',
                'error'
              );
            } else {
              this.toastService.showError('Dokument konnte nicht geladen werden', error);
            }
          },
        });
      });
  }

  private toItem(document: HvtdpDocument): DocumentItem {
    return {
      document,
      title: document.title,
      date: document.date ? DateUtil.formatDate(document.date) : '',
      locked: document.protected,
    };
  }

  /** Groups by category; dated documents newest first, the others in the order maintained in Strapi. */
  private group(items: DocumentItem[]): DocumentGroup[] {
    const newestFirst = (a: DocumentItem, b: DocumentItem) =>
      (b.document.date ?? '').localeCompare(a.document.date ?? '');
    return GROUPS.map(({ category, title }) => ({
      title,
      items: items.filter((item) => item.document.category === category).sort(newestFirst),
    })).filter((group) => group.items.length);
  }
}
