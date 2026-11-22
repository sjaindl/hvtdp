import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { DocumentsComponent } from './documents.component';

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;
  let http: HttpTestingController;

  const doc = (
    title: string,
    category: string,
    date: string | null,
    order: number,
    isProtected = false
  ) => ({
    documentId: `doc-${order}`,
    slug: null,
    title,
    date,
    category,
    file: { url: `/uploads/${order}.pdf` },
    protected: isProtected,
    order,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('groups documents by category, dated ones newest first', () => {
    http
      .expectOne((r) => r.url === `${environment.cmsUrl}/api/documents`)
      .flush({
        data: [
          doc('Beitrittserklärung', 'Allgemein', null, 1),
          doc('Statuten', 'Allgemein', null, 2, true),
          doc('Sitzungsprotokoll', 'Protokolle', '2018-01-30', 5, true),
          doc('Endergebnis Hallenturnier', 'Turnierergebnisse', '2025-01-11', 14),
          doc('Protokoll Jahreshauptversammlung', 'Protokolle', '2026-09-23', 18, true),
        ],
        meta: { pagination: { page: 1, pageCount: 1 } },
      });

    expect(
      component.groups.map((group) => [group.title, group.items.map((item) => item.title)])
    ).toEqual([
      ['Für Mitglieder & Fans', ['Beitrittserklärung', 'Statuten']],
      ['Turnierergebnisse', ['Endergebnis Hallenturnier']],
      ['Protokolle & Vereinsdokumente', ['Protokoll Jahreshauptversammlung', 'Sitzungsprotokoll']],
    ]);
    const minutes = component.groups[2].items[0];
    expect(minutes.date).toBe('23.09.2026');
    expect(minutes.locked).toBeTrue();
  });
});
