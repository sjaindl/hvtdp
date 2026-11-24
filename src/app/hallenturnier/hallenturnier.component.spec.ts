import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { HallenturnierComponent } from './hallenturnier.component';

describe('HallenturnierComponent', () => {
  let component: HallenturnierComponent;
  let fixture: ComponentFixture<HallenturnierComponent>;
  let http: HttpTestingController;
  const entry = {
    title: '17. Stainzer Hallenturnier 2027',
    lead: null,
    image: null,
    date: '2027-01-09',
    dateHint: null,
    location: 'Mittelschule Stainz',
    format: '3 + 1',
    entryFee: 70,
    registrationDeadline: null,
    registrationOpen: true,
    prizes: [],
    bankRecipient: 'HV TDP Stainz',
    iban: 'AT67',
    paymentReference: 'Hallenturnier 2027',
    lastEditionAlbum: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallenturnierComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(HallenturnierComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  const flush = (data: object) =>
    http.expectOne((r) => r.url === `${environment.cmsUrl}/api/hallenturnier`).flush({ data });

  it('loads the tournament and posts the registration to Strapi', () => {
    flush(entry);
    expect(component.tournament?.registrationOpen).toBeTrue();
    component.form.setValue({
      name: 'Max Muster',
      email: 'max@example.com',
      teamname: 'Die Hallenhelden',
      website: '',
    });
    component.onSubmit();
    const request = http.expectOne(
      `${environment.cmsUrl}/api/hallenturnier-registrations/register`
    );
    expect(request.request.body.teamName).toBe('Die Hallenhelden');
    request.flush({ ok: true });
    expect(component.submitted).toBeTrue();
  });

  it('knows when the registration is closed (the form is replaced by a note)', () => {
    flush({ ...entry, registrationOpen: false });
    expect(component.tournament?.registrationOpen).toBeFalse();
  });
});
