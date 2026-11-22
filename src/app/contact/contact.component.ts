import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Meta, Title } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Feedback } from '../shared/feedback';
import { GOOGLE_MAPS_API_KEY } from '../shared/keys';
import { CLUB_EMAIL } from '../shared/seasons';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

const STADIUM = { lat: 46.899395, lng: 15.248251 };

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    GoogleMapsModule,
    EmptyStateComponent,
    PageIntroComponent,
  ],
})
export class ContactComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private httpClient = inject(HttpClient);

  readonly email = CLUB_EMAIL;
  readonly stadium = STADIUM;
  readonly routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${STADIUM.lat},${STADIUM.lng}`;

  feedbackForm: FormGroup = this.formBuilder.group({
    firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    email: ['', [Validators.required, Validators.email]],
    agreeContact: false,
    agreeGDPR: [false, [Validators.requiredTrue]],
    message: '',
  });
  submitted = false;
  apiLoaded?: Observable<boolean>;
  mapOptions: google.maps.MapOptions = {};

  formErrors: Record<string, string> = {
    firstname: '',
    lastname: '',
    email: '',
    agreeGDPR: '',
  };

  validationMessages: Record<string, Record<string, string>> = {
    firstname: {
      required: 'Vorname ist verpflichtend.',
      minlength: 'Der Vorname muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Der Vorname darf maximal 25 Zeichen lang sein.',
    },
    lastname: {
      required: 'Nachname ist verpflichtend.',
      minlength: 'Der Nachname muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Der Nachname darf maximal 25 Zeichen lang sein.',
    },
    email: {
      required: 'Die E-Mail ist verpflichtend.',
      email: 'E-Mail hat kein gültiges Format.',
    },
    agreeGDPR: {
      required: 'Die DSGVO muss akzeptiert werden.',
    },
  };

  constructor() {
    this.feedbackForm.valueChanges.subscribe(() => this.updateErrors());
  }

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Kontakt');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Kontaktiere den HV TDP Stainz: Adresse, Feedback und Stadion.',
    });

    this.apiLoaded = this.httpClient
      .jsonp('https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY, 'callback')
      .pipe(
        map(() => {
          this.mapOptions = {
            center: STADIUM,
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: true,
            // Neutral map so it fits the pink/gray palette.
            styles: [{ stylers: [{ saturation: -100 }] }],
          };
          return true;
        }),
        catchError(() => of(false)),
        shareReplay(1)
      );
  }

  updateErrors(showAll = false) {
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = this.feedbackForm.get(field);
      if (control && (control.dirty || showAll) && !control.valid) {
        const messages = this.validationMessages[field];
        this.formErrors[field] = Object.keys(control.errors ?? {})
          .map((key) => messages[key] ?? messages['required'])
          .join(' ');
      }
    }
  }

  onSubmit() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      this.updateErrors(true);
      return;
    }
    const feedback: Feedback = this.feedbackForm.value;
    let subject = `Feedback ${feedback.firstname} ${feedback.lastname}, ${feedback.email}`;
    if (feedback.agreeContact) {
      subject += ', Kontaktaufnahme erlaubt';
    }
    // Opens the visitor's mail app – there is no feedback endpoint in the API.
    window.location.href = `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(feedback.message ?? '')}`;
    this.submitted = true;
  }

  newMessage() {
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      agreeContact: false,
      agreeGDPR: false,
      message: '',
    });
    this.submitted = false;
  }
}
