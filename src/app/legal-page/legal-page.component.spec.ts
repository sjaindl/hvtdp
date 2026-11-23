import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { LegalPageComponent } from './legal-page.component';

describe('LegalPageComponent', () => {
  let component: LegalPageComponent;
  let fixture: ComponentFixture<LegalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalPageComponent],
      providers: [
        ...provideTestDependencies(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { slug: 'impressum' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the page by slug, shows the date and highlights missing data', () => {
    const request = TestBed.inject(HttpTestingController).expectOne(
      (r) => r.url === `${environment.cmsUrl}/api/legal-pages`
    );
    expect(request.request.params.get('filters[slug][$eq]')).toBe('impressum');
    request.flush({
      data: [
        {
          title: 'Impressum',
          content: '## Medieninhaber\n\n**ZVR-Zahl:** [[ZVR-Zahl]]',
          effectiveDate: '2026-11-23',
        },
      ],
      meta: { pagination: { page: 1, pageCount: 1 } },
    });
    expect(component.page?.asOf).toBe('Stand 23.11.2026');
    expect(component.incomplete).toBeTrue();
    expect(component.html).toContain('<h2>Medieninhaber</h2>');
    expect(component.html).toContain('<mark');
    expect(component.html).toContain('ZVR-Zahl</mark>');
    expect(component.html).not.toContain('[[');
  });
});
