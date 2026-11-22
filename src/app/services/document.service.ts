import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { DocumentCategory, HvtdpDocument } from '../shared/document';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { CmsService } from './cms.service';

interface StrapiDocument {
  documentId: string;
  slug: string | null;
  title: string;
  date: string | null;
  category: DocumentCategory;
  file: StrapiMedia | null;
  protected: boolean | null;
}

/**
 * Downloads of the documents page from Strapi. Protected documents have no public file URL; they are
 * fetched with the members' password from the download endpoint, which checks it on the server.
 */
@Injectable({ providedIn: 'root' })
export class DocumentService {
  private cms = inject(CmsService);
  private http = inject(HttpClient);

  getDocuments(): Observable<HvtdpDocument[]> {
    return this.cms
      .getCollection<StrapiDocument>('documents', { 'sort[0]': 'order:asc', 'populate[0]': 'file' })
      .pipe(
        map((documents) =>
          documents.map((document) => ({
            id: document.documentId,
            slug: document.slug,
            title: document.title,
            date: document.date,
            category: document.category,
            url: mediaUrl(document.file),
            protected: document.protected ?? false,
          }))
        )
      );
  }

  /** The document with a fixed key (e.g. "beitrittserklaerung"), or null. */
  getDocument(slug: string): Observable<HvtdpDocument | null> {
    return this.getDocuments().pipe(
      map((documents) => documents.find((document) => document.slug === slug) ?? null)
    );
  }

  /** The PDF; the server answers 401 for a wrong password and 429 after too many attempts. */
  download(document: HvtdpDocument, password?: string): Observable<Blob> {
    return this.http.post(
      `${environment.cmsUrl}/api/documents/${document.id}/download`,
      { password },
      { responseType: 'blob' }
    );
  }

  /** Hands a downloaded file to the browser as a download. */
  save(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}
