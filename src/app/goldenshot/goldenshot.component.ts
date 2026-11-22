import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoldenShot } from '../shared/goldenshot';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { FileUploadService } from '../services/file-upload.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-goldenshot',
  templateUrl: './goldenshot.component.html',
  styleUrls: ['./goldenshot.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
})
export class GoldenshotComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private mysqlService = inject(MysqlService);
  private fileUploadService = inject(FileUploadService);
  private deviceService = inject(DeviceDetectorService);

  isMobile = false;

  feedbackForm!: FormGroup; // built by createForm() in the constructor
  submittedFormData: GoldenShot | null = null;

  fileName = '';
  file: File | null = null;

  formErrors: Record<string, string> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

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
    this.createForm();
  }

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Golden Shot');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Melde dich an für den Golden Shot des HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);

    this.checkDevice();
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(30),
          Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'),
        ],
      ],
    });

    this.onValueChanged(); // (re)set validation messages now

    this.feedbackForm.valueChanges.subscribe(() => this.onValueChanged());
  }

  onValueChanged() {
    if (!this.feedbackForm) {
      return;
    }

    for (const field in this.formErrors) {
      this.formErrors[field] = ''; // clear previous error message (if any)
      const control = this.feedbackForm.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    const formData: GoldenShot = this.feedbackForm.value;
    this.submittedFormData = formData;

    console.log(`send to server: ${formData.firstName}, ${formData.lastName},
    ${formData.phone}, ${formData.email}, ${this.fileName}`);

    if (this.file) {
      this.fileUploadService.upload(this.file).subscribe((result) => {
        console.log(`response from server: ${result}`);
      });
    }

    this.mysqlService
      .postGoldenShotRegistration(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        this.fileName
      )
      .subscribe((result) => {
        console.log(`response from server: ${result}`);
      });

    this.feedbackForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }
}
