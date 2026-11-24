import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { HvtdpDocument } from '../shared/document';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;

  const list = {
    data: [
      {
        documentId: 'abc',
        slug: 'beitrittserklaerung',
        title: 'Beitrittserklärung',
        date: null,
        category: 'Allgemein',
        file: { url: '/uploads/beitrittserklaerung.pdf' },
        protected: false,
      },
      {
        documentId: 'def',
        slug: 'statuten',
        title: 'Statuten',
        date: null,
        category: 'Allgemein',
        file: null,
        protected: true,
      },
    ],
    meta: { pagination: { page: 1, pageCount: 1 } },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(DocumentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps documents; protected ones have no public URL', () => {
    let documents: HvtdpDocument[] = [];
    service.getDocuments().subscribe((result) => (documents = result));
    const request = http.expectOne((r) => r.url === `${api}/documents`);
    expect(request.request.params.get('populate[0]')).toBe('file');
    request.flush(list);
    expect(documents).toEqual([
      {
        id: 'abc',
        slug: 'beitrittserklaerung',
        title: 'Beitrittserklärung',
        date: null,
        category: 'Allgemein',
        url: `${environment.cmsUrl}/uploads/beitrittserklaerung.pdf`,
        protected: false,
      },
      {
        id: 'def',
        slug: 'statuten',
        title: 'Statuten',
        date: null,
        category: 'Allgemein',
        url: null,
        protected: true,
      },
    ]);
  });

  it('finds a document by its slug', () => {
    let form: HvtdpDocument | null = null;
    let missing: HvtdpDocument | null | undefined;
    service.getDocument('beitrittserklaerung').subscribe((document) => (form = document));
    service.getDocument('gibt-es-nicht').subscribe((document) => (missing = document));
    http.expectOne((r) => r.url === `${api}/documents`).flush(list);
    expect((form as HvtdpDocument | null)?.title).toBe('Beitrittserklärung');
    expect(missing).toBeNull();
  });

  it('downloads a document with the password from the download endpoint', () => {
    const document = { id: 'def', title: 'Statuten', protected: true } as HvtdpDocument;
    let size = 0;
    service.download(document, 'geheim').subscribe((blob) => (size = blob.size));
    const request = http.expectOne(`${api}/documents/def/download`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ password: 'geheim' });
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['%PDF-1.3'], { type: 'application/pdf' }));
    expect(size).toBe(8);
  });
});
