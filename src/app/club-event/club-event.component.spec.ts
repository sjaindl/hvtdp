import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { ClubEventComponent } from './club-event.component';

describe('ClubEventComponent', () => {
  let component: ClubEventComponent;
  let fixture: ComponentFixture<ClubEventComponent>;
  let http: HttpTestingController;
  const api = `${environment.cmsUrl}/api`;
  const event = (overrides: object) => ({
    data: [
      {
        slug: 'entenrennen',
        active: true,
        title: 'Entenrennen',
        lead: null,
        image: null,
        description: '### Preise',
        date: null,
        startTime: null,
        location: null,
        format: null,
        formType: 'order',
        price: 3,
        orderUnit: 'Ente',
        orderUnitPlural: 'Enten',
        phoneRequired: false,
        registrationOpen: true,
        registrationDeadline: null,
        bankRecipient: null,
        iban: null,
        bic: null,
        paymentReference: null,
        ...overrides,
      },
    ],
    meta: { pagination: { page: 1, pageCount: 1 } },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubEventComponent],
      providers: [
        ...provideTestDependencies(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { slug: 'entenrennen' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubEventComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  const flush = (overrides: object = {}) => {
    const request = http.expectOne((r) => r.url === `${api}/club-events`);
    expect(request.request.params.get('filters[slug][$eq]')).toBe('entenrennen');
    request.flush(event(overrides));
  };

  it('orders need address, phone and quantity, and show the total', () => {
    flush();
    component.form.patchValue({ name: 'Max Muster', email: 'max@example.com', quantity: 5 });
    expect(component.total).toBe('15 €');
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ phone: '0664 1234567', address: 'Hauptplatz 1, 8510 Stainz' });
    expect(component.form.valid).toBeTrue();

    component.onSubmit();
    const request = http.expectOne(`${api}/club-event-registrations/register`);
    expect(request.request.body).toEqual(
      jasmine.objectContaining({ event: 'entenrennen', quantity: 5, teamName: '' })
    );
    request.flush({ ok: true });
    expect(component.submitted).toBeTrue();
  });

  it('team registrations need a team name instead', () => {
    flush({ formType: 'team', price: 20 });
    component.form.patchValue({ name: 'Max Muster', email: 'max@example.com' });
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ teamName: 'Die Kugelblitze' });
    expect(component.form.valid).toBeTrue();
  });
});
