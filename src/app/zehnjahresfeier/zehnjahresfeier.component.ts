import { Component, OnInit } from '@angular/core';
import { Feedback } from '../shared/feedback'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Title, Meta } from '@angular/platform-browser'
import { MysqlService } from '../services/mysql.service'

@Component({
  selector: 'app-zehnjahresfeier',
  templateUrl: './zehnjahresfeier.component.html',
  styleUrls: ['./zehnjahresfeier.component.css']
})
export class ZehnjahresfeierComponent implements OnInit {
  feedbackForm: FormGroup
  feedback: Feedback
  submittedFeedback = null

  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': '',
    'address': '',
    'ticketcount': ''
  }

  validationMessages = {
    'firstname': {
      'required':      'Der Vorname ist verpflichtend.',
      'minlength':     'Der Vorname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Vorname darf maximal 25 Zeichen lang sein.'
    },
    'lastname': {
      'required':      'Der Nachname ist verpflichtend.',
      'minlength':     'Der Nachname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Nachname darf maximal 25 Zeichen lang sein.'
    },
    'address': {
      'required':      'Die Adresse ist verpflichtend.',
      'minlength':     'Die Adresse muss mindestens 10 Zeichen lang sein.',
      'maxlength':     'Die Adresse darf maximal 100 Zeichen lang sein.'
    },
    'email': {
      'required':      'Die E-Mail ist verpflichtend.',
      'email':         'E-Mail hat kein gültiges Format.'
    },
    'ticketcount': {
      'pattern':       'Die Ticketanzahl ist ungültig.',
      'required':      'Die Ticketanzahl ist verpflichtend.'
    },
  }

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private metaTagService: Meta,
    private mysqlService: MysqlService) {
    this.createForm()
  }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: 10-Jahresjubiläum")
    this.metaTagService.updateTag({
      name: 'description', content: "Bestelle hier deine Tickets für das 10-Jahresjubiläum des HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)] ],
      email: ['', [Validators.required, Validators.email] ],
      ticketcount: ['', [Validators.minLength(1), Validators.pattern("[0-9]*")] ],
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
    this.feedback = this.feedbackForm.value
    this.submittedFeedback = this.feedback

    console.log(`send to server: ${this.submittedFeedback.firstname}, ${this.submittedFeedback.lastname},
    ${this.submittedFeedback.email}, ${this.submittedFeedback.address}, ${this.submittedFeedback.ticketcount}`)

    this.mysqlService.postTenYearJubilaeum(
      this.submittedFeedback.firstname,
      this.submittedFeedback.lastname,
      this.submittedFeedback.email,
      this.submittedFeedback.address,
      this.submittedFeedback.ticketcount
      ).subscribe(result => {
        console.log(`response from server: ${result}`)
    })

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      ticketcount: ''
    })
  }
}
