import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Marked } from 'marked';
import { CookieService } from 'ngx-cookie-service';
import { of, switchMap } from 'rxjs';
import { PageService } from '../services/page.service';
import { PollService } from '../services/poll.service';
import { GoldenShotPage } from '../shared/page';
import { PollOption } from '../shared/poll';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { ToastService } from '../ui/toast/toast.service';
import { VoteBarComponent } from '../ui/vote-bar/vote-bar.component';

const GOLDENSHOT_VOTING_COOKIE_KEY = 'goldenshot_voted';
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Torschuss Challenge (Golden Shot): info, registration with photo, voting and result – all from Strapi. */
@Component({
  selector: 'app-goldenshot',
  templateUrl: './goldenshot.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, EmptyStateComponent, ZoomableDirective, VoteBarComponent],
})
export class GoldenshotComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private cookieService = inject(CookieService);
  private pageService = inject(PageService);
  private pollService = inject(PollService);
  private toastService = inject(ToastService);

  private readonly markdown = new Marked({ breaks: true, gfm: true });

  page: GoldenShotPage | null = null;
  descriptionHtml = '';
  candidates: PollOption[] = [];
  selected: PollOption | null = null;
  canVote = false;
  voting = false;
  loaded = false;
  failed = false;
  errorText = '';

  form: FormGroup;
  photo: File | null = null;
  photoError = '';
  submitted = false;
  busy = false;

  formErrors: Record<string, string> = { firstName: '', lastName: '', email: '', phone: '' };
  validationMessages: Record<string, Record<string, string>> = {
    firstName: {
      required: 'Der Vorname ist verpflichtend.',
      minlength: 'Der Vorname muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Der Vorname darf maximal 25 Zeichen lang sein.',
    },
    lastName: {
      required: 'Der Nachname ist verpflichtend.',
      minlength: 'Der Nachname muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Der Nachname darf maximal 25 Zeichen lang sein.',
    },
    email: {
      required: 'Die E-Mail ist verpflichtend.',
      email: 'E-Mail hat kein gültiges Format.',
    },
    phone: {
      minlength: 'Die Telefonnummer muss mindestens 10 Zeichen lang sein.',
      maxlength: 'Die Telefonnummer darf maximal 30 Zeichen lang sein.',
      pattern: 'Telefonnummer hat kein gültiges Format.',
    },
  };

  constructor() {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(30),
          Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/),
        ],
      ],
      // Honeypot: hidden from people, bots fill it in (the server then stores nothing).
      website: [''],
    });
    this.form.valueChanges.subscribe(() => this.updateErrors());
  }

  ngOnInit() {
    this.canVote = !this.cookieService.check(GOLDENSHOT_VOTING_COOKIE_KEY);
    this.titleService.setTitle('HV TDP Stainz: Torschuss Challenge');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Melde dich an und stimme ab für die Torschuss Challenge des HV TDP Stainz.',
    });
    this.load();
  }

  load() {
    this.failed = false;
    this.pageService
      .getGoldenShot()
      .pipe(
        switchMap((page) => {
          this.page = page;
          this.descriptionHtml = page ? (this.markdown.parse(page.description) as string) : '';
          if (page?.active) {
            this.titleService.setTitle(`HV TDP Stainz: ${page.title}`);
          }
          return page?.active && page.poll
            ? this.pollService.getOptions('goldenShot', page.poll.year)
            : of([]);
        })
      )
      .subscribe({
        next: (options) => {
          // Alphabetical by last name, as announced on the page.
          const lastName = (name: string) => name.split(' ').slice(-1)[0] ?? name;
          this.candidates = [...options].sort(
            (a, b) =>
              lastName(a.name).localeCompare(lastName(b.name), 'de-DE') ||
              a.name.localeCompare(b.name, 'de-DE')
          );
          this.loaded = true;
        },
        error: (error: unknown) => {
          this.loaded = true;
          this.failed = true;
          this.errorText = ErrorUtil.message(error);
        },
      });
  }

  get votingOpen(): boolean {
    return !!this.page?.poll?.open;
  }

  choose(option: PollOption) {
    if (this.votingOpen && this.canVote) {
      this.selected = option;
    }
  }

  vote() {
    if (!this.selected) {
      return;
    }
    this.voting = true;
    this.pollService.vote(this.selected).subscribe({
      next: () => {
        this.cookieService.set(GOLDENSHOT_VOTING_COOKIE_KEY, 'true', 1 / 24); // expires after 1 hour
        this.canVote = false;
        this.voting = false;
        this.toastService.show('Deine Stimme wurde gezählt');
      },
      error: (error: unknown) => {
        this.voting = false;
        this.toastService.showError('Senden fehlgeschlagen', error, 'Erneut', () => this.vote());
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

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.photoError =
      file && (!file.type.startsWith('image/') || file.size > MAX_PHOTO_BYTES)
        ? 'Bitte ein Bild (JPG, PNG, WebP, HEIC) mit höchstens 10 MB wählen.'
        : '';
    this.photo = this.photoError ? null : file;
  }

  scrollToForm() {
    document.getElementById('anmeldung')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit() {
    if (this.form.invalid || this.photoError) {
      this.form.markAllAsTouched();
      this.updateErrors(true);
      return;
    }
    const data = new FormData();
    for (const [key, value] of Object.entries(this.form.value as Record<string, string>)) {
      data.append(key, value ?? '');
    }
    if (this.photo) {
      data.append('photo', this.photo, this.photo.name);
    }
    this.busy = true;
    this.pageService.registerGoldenShot(data).subscribe({
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
