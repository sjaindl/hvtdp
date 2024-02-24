import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoldenShot } from '../shared/goldenshot';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { FileUploadService } from '../services/file-upload.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-goldenshot',
  templateUrl: './goldenshot.component.html',
  styleUrls: ['./goldenshot.component.css']
})
export class GoldenshotComponent implements OnInit {

  isMobile = null

  feedbackForm: FormGroup
  goldenShotFormData: GoldenShot
  submittedFormData = null

  fileName = '';
  file: File = null;

  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'phone': '',
  }

  validationMessages = {
    'firstName': {
      'required':      'Der Vorname ist verpflichtend.',
      'minlength':     'Der Vorname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Vorname darf maximal 25 Zeichen lang sein.'
    },
    'lastName': {
      'required':      'Der Nachname ist verpflichtend.',
      'minlength':     'Der Nachname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Nachname darf maximal 25 Zeichen lang sein.'
    },
    'email': {
      'required':      'Die E-Mail ist verpflichtend.',
      'email':         'E-Mail hat kein gültiges Format.'
    },
    'phone': {
      'minlength':     'Die Telefonnummer muss mindestens 10 Zeichen lang sein.',
      'maxlength':     'Die Telefonnummer darf maximal 30 Zeichen lang sein.',
      'pattern':       'Telefonnummer hat kein gültiges Format.'
    },
  }

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private metaTagService: Meta,
    private mysqlService: MysqlService,
    private fileUploadService: FileUploadService,
    private deviceService: DeviceDetectorService,
    ) {
      this.createForm()
  }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: Golden Shot")
    this.metaTagService.updateTag({
      name: 'description', content: "Melde dich an für den Golden Shot des HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])

    this.checkDevice()
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      email: ['', [Validators.required, Validators.email] ],
      phone: ['', [Validators.minLength(10), Validators.maxLength(30), Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$")] ],
    })

    this.onValueChanged() // (re)set validation messages now

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data))
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return
    }

    for (const field in this.formErrors) {
      this.formErrors[field] = '' // clear previous error message (if any)
      const control = this.feedbackForm.get(field)
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field]
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' '
        }
      }
    }
  }

  onSubmit() {
    this.goldenShotFormData = this.feedbackForm.value
    this.submittedFormData = this.goldenShotFormData

    console.log(`send to server: ${this.submittedFormData.firstName}, ${this.submittedFormData.lastName},
    ${this.submittedFormData.phone}, ${this.submittedFormData.email}, ${this.fileName}`)

    if(this.file) {
      this.fileUploadService.upload(this.file).subscribe(result => {
        console.log(`response from server: ${result}`)
      })
    }

    this.mysqlService.postGoldenShotRegistration(
      this.submittedFormData.firstName,
      this.submittedFormData.lastName,
      this.submittedFormData.email,
      this.submittedFormData.phone,
      this.fileName,
      ).subscribe(result => {
        console.log(`response from server: ${result}`)
    })

    this.feedbackForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    })
  }

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {
        this.file = file
        this.fileName = file.name;
    }
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile()
  }
}
