import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { GoldenshotComponent } from './goldenshot.component';

describe('GoldenshotComponent', () => {
  let component: GoldenshotComponent;
  let fixture: ComponentFixture<GoldenshotComponent>;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const page = {
    active: true,
    title: 'Torschuss Challenge 2027',
    sponsor: null,
    image: null,
    description: 'Von der **Mittellinie** ins Tor.',
    finalDate: null,
    registrationOpen: true,
    registrationDeadline: null,
    poll: { year: '2027', open: true, closesAt: null },
    resultImage: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldenshotComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(GoldenshotComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('shows the participants of the voting alphabetically by last name', () => {
    http.expectOne((r) => r.url === `${api}/golden-shot`).flush({ data: page });
    expect(component.descriptionHtml).toContain('<strong>Mittellinie</strong>');
    const request = http.expectOne((r) => r.url === `${api}/poll-options`);
    expect(request.request.params.get('filters[poll][type][$eq]')).toBe('goldenShot');
    request.flush({
      data: [
        { documentId: 'z', name: 'Anna Zach', image: null, player: null, video: null },
        {
          documentId: 'b',
          name: 'Max Berger',
          image: { url: '/uploads/b.jpg' },
          player: null,
          video: null,
        },
      ],
      meta: { pagination: { page: 1, pageCount: 1 } },
    });
    expect(component.candidates.map((option) => option.name)).toEqual(['Max Berger', 'Anna Zach']);
    expect(component.candidates[0].imageUrl).toBe(`${environment.cmsUrl}/uploads/b.jpg`);
    expect(component.votingOpen).toBeTrue();
  });

  it('sends the registration as multipart with the photo', () => {
    http.expectOne((r) => r.url === `${api}/golden-shot`).flush({ data: { ...page, poll: null } });
    component.form.setValue({
      firstName: 'Max',
      lastName: 'Muster',
      email: 'max@example.com',
      phone: '',
      website: '',
    });
    component.onPhotoSelected({
      target: { files: [new File(['x'], 'max.jpg', { type: 'image/jpeg' })] },
    } as unknown as Event);
    component.onSubmit();
    const request = http.expectOne(`${api}/golden-shot-registrations/register`);
    const body = request.request.body as FormData;
    expect(body.get('lastName')).toBe('Muster');
    expect((body.get('photo') as File).name).toBe('max.jpg');
    request.flush({ ok: true });
    expect(component.submitted).toBeTrue();
  });

  it('rejects files that are not images', () => {
    component.onPhotoSelected({
      target: { files: [new File(['x'], 'doc.pdf', { type: 'application/pdf' })] },
    } as unknown as Event);
    expect(component.photo).toBeNull();
    expect(component.photoError).toContain('Bild');
  });
});
