import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { PageService } from '../services/page.service';
import { Hallenturnier } from '../shared/page';
import { ErrorUtil } from '../shared/utils/error.util';
import { CLUB_EMAIL } from '../shared/seasons';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { ToastService } from '../ui/toast/toast.service';

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
  private pageService = inject(PageService);
  private toastService = inject(ToastService);

  /** The current tournament from Strapi (null until loaded or when none is entered). */
  tournament: Hallenturnier | null = null;
  loaded = false;
  failed = false;
  errorText = '';
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

  formErrors: Record<string, string> = { name: '', email: '', teamname: '' };
  validationMessages: Record<string, Record<string, string>> = {
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
      // Honeypot: hidden from people, bots fill it in (the server then stores nothing).
      website: [''],
    });
    this.form.valueChanges.subscribe(() => this.updateErrors());
  }

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Hallenturnier');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Melde dich an für das Hallenturnier des HV TDP Stainz.',
    });
    this.load();
  }

  load() {
    this.failed = false;
    this.pageService.getHallenturnier().subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        this.loaded = true;
        if (tournament) {
          this.titleService.setTitle(`HV TDP Stainz: ${tournament.title}`);
        }
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
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
    const { name, email, teamname, website } = this.form.value;
    this.busy = true;
    this.pageService.register({ name, email, teamName: teamname, website }).subscribe({
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
