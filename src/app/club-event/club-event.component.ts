import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Marked } from 'marked';
import { PageService } from '../services/page.service';
import { CLUB_EMAIL } from '../shared/seasons';
import { ClubEvent } from '../shared/page';
import { ErrorUtil } from '../shared/utils/error.util';
import { formatPrice } from '../shared/utils/price.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { ToastService } from '../ui/toast/toast.service';

const PHONE = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

/**
 * Event page with registration or order (Bocciaturnier, Kleinfeldturnier, Big Darts, Entenrennen, …). The route
 * passes the event's slug as data; texts, facts and the form type come from Strapi (`club-event`).
 */
@Component({
  selector: 'app-club-event',
  templateUrl: './club-event.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, EmptyStateComponent, ZoomableDirective],
})
export class ClubEventComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private pageService = inject(PageService);
  private toastService = inject(ToastService);

  private readonly markdown = new Marked({ breaks: true, gfm: true });
  readonly clubEmail = CLUB_EMAIL;

  event: ClubEvent | null = null;
  descriptionHtml = '';
  loaded = false;
  failed = false;
  errorText = '';

  form: FormGroup;
  submitted = false;
  busy = false;
  formErrors: Record<string, string> = {};

  private readonly messages: Record<string, Record<string, string>> = {
    name: {
      required: 'Der Name ist verpflichtend.',
      minlength: 'Der Name muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Der Name darf maximal 50 Zeichen lang sein.',
    },
    email: { required: 'Die E-Mail ist verpflichtend.', email: 'E-Mail hat kein gültiges Format.' },
    phone: {
      required: 'Die Telefonnummer ist verpflichtend.',
      minlength: 'Die Telefonnummer muss mindestens 10 Zeichen lang sein.',
      maxlength: 'Die Telefonnummer darf maximal 30 Zeichen lang sein.',
      pattern: 'Telefonnummer hat kein gültiges Format.',
    },
    teamName: { required: 'Der Mannschaftsname ist verpflichtend.' },
    address: {
      required: 'Die Adresse ist verpflichtend.',
      minlength: 'Die Adresse muss mindestens 10 Zeichen lang sein.',
    },
    quantity: {
      required: 'Bitte die Anzahl angeben.',
      min: 'Mindestens 1.',
      max: 'Höchstens 100.',
    },
  };

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      teamName: [''],
      address: [''],
      quantity: [1],
      // Honeypot: hidden from people, bots fill it in (the server then stores nothing).
      website: [''],
    });
    this.form.valueChanges.subscribe(() => this.updateErrors());
  }

  ngOnInit() {
    this.load();
  }

  get slug(): string {
    return this.route.snapshot.data['slug'] ?? '';
  }

  get isOrder(): boolean {
    return this.event?.formType === 'order';
  }

  /** "15 €" for 5 ducks à 3 €. */
  get total(): string {
    const quantity = Number(this.form.value.quantity) || 0;
    const price = this.event?.price ?? 0;
    const sum = quantity * price;
    return Number.isInteger(sum) ? `${sum} €` : formatPrice(sum);
  }

  load() {
    this.failed = false;
    this.pageService.getEvent(this.slug).subscribe({
      next: (event) => {
        this.event = event;
        this.descriptionHtml = event ? (this.markdown.parse(event.description) as string) : '';
        this.loaded = true;
        if (event) {
          this.configureForm(event);
          this.titleService.setTitle(`HV TDP Stainz: ${event.title}`);
          this.metaTagService.updateTag({
            name: 'description',
            content: event.lead || event.title,
          });
        }
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  /** Team registrations need a team name, orders an address and a quantity; the phone depends on the event. */
  private configureForm(event: ClubEvent) {
    const order = event.formType === 'order';
    const phone = [Validators.minLength(10), Validators.maxLength(30), Validators.pattern(PHONE)];
    this.form.controls['phone'].setValidators(
      event.phoneRequired ? [Validators.required, ...phone] : phone
    );
    this.form.controls['teamName'].setValidators(order ? [] : [Validators.required]);
    this.form.controls['address'].setValidators(
      order ? [Validators.required, Validators.minLength(10), Validators.maxLength(150)] : []
    );
    this.form.controls['quantity'].setValidators(
      order ? [Validators.required, Validators.min(1), Validators.max(100)] : []
    );
    for (const control of Object.values(this.form.controls)) {
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  updateErrors(showAll = false) {
    const errors: Record<string, string> = {};
    for (const [field, control] of Object.entries(this.form.controls)) {
      if (control.invalid && (control.dirty || showAll) && this.messages[field]) {
        errors[field] = Object.keys(control.errors ?? {})
          .map((key) => this.messages[field][key])
          .join(' ');
      }
    }
    this.formErrors = errors;
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
    if (!this.event || this.form.invalid) {
      this.form.markAllAsTouched();
      this.updateErrors(true);
      return;
    }
    const value = this.form.value;
    this.busy = true;
    this.pageService
      .registerEvent({
        event: this.event.slug,
        name: value.name,
        email: value.email,
        phone: value.phone ?? '',
        teamName: this.isOrder ? '' : value.teamName,
        address: this.isOrder ? value.address : '',
        quantity: this.isOrder ? Number(value.quantity) : null,
        website: value.website ?? '',
      })
      .subscribe({
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
