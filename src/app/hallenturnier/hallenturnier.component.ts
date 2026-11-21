import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { CLUB_EMAIL } from '../shared/seasons';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { ToastService } from '../ui/toast/toast.service';

/**
 * TODO(API): tournament details are maintained here per edition – move them to the CMS/API so they
 * can be updated without a deployment.
 */
const TOURNAMENT = {
  title: '17. Stainzer Hallenturnier 2027',
  image: 'assets/images/hallenturnier_2027.jpg',
  deadline: 'Di, 05.01.2027',
  facts: [
    {
      icon: 'event',
      label: 'Wann',
      value: 'Sa, 09.01.2027',
      hint: 'Erweiterung auf Fr, 08.01. möglich',
    },
    { icon: 'location_on', label: 'Wo', value: 'Mittelschule Stainz', hint: '' },
    { icon: 'groups', label: 'Spielform', value: '3 + 1', hint: '' },
    { icon: 'payments', label: 'Nenngeld', value: '70 € pro Team', hint: '' },
  ],
  prizes: [
    'Urkunde für jede teilnehmende Mannschaft',
    'Pokal und Sachpreise für die besten 8 Mannschaften',
    'Offizielles Siegertrikot für jeden Spieler der Siegermannschaft',
  ],
  bank: {
    recipient: 'HV TDP Stainz',
    iban: 'AT67 3843 9000 0481 3481',
    reference: 'Hallenturnier 2027 + Mannschaftsname',
  },
  lastEdition: {
    album: '/gallery/2026/16-stainzer-hallenturnier',
    albumTitle: '16. Stainzer Hallenturnier',
  },
};

@Component({
  selector: 'app-hallenturnier',
  templateUrl: './hallenturnier.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, EmptyStateComponent, ZoomableDirective],
})
export class HallenturnierComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private mysqlService = inject(MysqlService);
  private toastService = inject(ToastService);

  readonly tournament = TOURNAMENT;
  readonly channels = [
    { icon: 'call', label: 'Telefon', value: '0664 4310021', href: 'tel:+436644310021' },
    { icon: 'mail', label: 'E-Mail', value: CLUB_EMAIL, href: `mailto:${CLUB_EMAIL}` },
    {
      icon: 'facebook',
      label: 'Facebook',
      value: 'HV TDP Stainz',
      href: 'https://www.facebook.com/hvtdpstainz/',
    },
    {
      icon: 'photo_camera',
      label: 'Instagram',
      value: '@hvtdpstainz_2014',
      href: 'https://www.instagram.com/hvtdpstainz_2014/',
    },
  ];

  form: FormGroup;
  submitted = false;
  busy = false;

  formErrors = { name: '', email: '', teamname: '' };
  validationMessages = {
    name: {
      required: 'Der Name ist verpflichtend.',
      minlength: 'Der Name muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Der Name darf maximal 25 Zeichen lang sein.',
    },
    email: {
      required: 'Die E-Mail ist verpflichtend.',
      email: 'E-Mail hat kein gültiges Format.',
    },
    teamname: {
      required: 'Der Teamname ist verpflichtend.',
    },
  };

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      teamname: ['', [Validators.required]],
    });
    this.form.valueChanges.subscribe(() => this.updateErrors());
  }

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Hallenturnier 2027');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Melde dich an für das Hallenturnier des HV TDP Stainz.',
    });
  }

  updateErrors(showAll = false) {
    for (const field of Object.keys(this.formErrors)) {
      const control = this.form.get(field);
      this.formErrors[field] =
        control && (control.dirty || showAll) && control.invalid
          ? Object.keys(control.errors ?? {})
              .map((key) => this.validationMessages[field][key])
              .join(' ')
          : '';
    }
  }

  scrollToForm() {
    document.getElementById('anmeldung')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      this.toastService.show('Kopiert');
    } catch {
      this.toastService.show('Kopieren nicht möglich', 'error');
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.updateErrors(true);
      return;
    }
    const { name, email, teamname } = this.form.value;
    this.busy = true;
    this.mysqlService.postHallenturnier(name, email, teamname).subscribe({
      next: () => {
        this.busy = false;
        this.submitted = true;
      },
      error: (error: unknown) => {
        this.busy = false;
        this.toastService.showError('Senden fehlgeschlagen', error, 'Erneut', () =>
          this.onSubmit()
        );
      },
    });
  }
}
