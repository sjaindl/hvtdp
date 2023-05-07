import { Component, OnInit } from '@angular/core'
import { Feedback } from '../shared/feedback'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Title, Meta } from '@angular/platform-browser'
import { MysqlService } from '../services/mysql.service'

@Component({
  selector: 'app-kleinfeldturnier',
  templateUrl: './kleinfeldturnier.component.html',
  styleUrls: ['./kleinfeldturnier.component.css']
})
export class KleinfeldTurnierComponent implements OnInit {
  feedbackForm: FormGroup
  feedback: Feedback
  submittedFeedback = null

  formErrors = {
    'name': '',
    'email': '',
    'phone': '',
    'teamname': ''
  }

  validationMessages = {
    'name': {
      'required':      'Die Ansprechperson ist verpflichtend.',
      'minlength':     'Die Ansprechperson muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Die Ansprechperson darf maximal 25 Zeichen lang sein.'
    },
    'email': {
      'required':      'Die E-Mail ist verpflichtend.',
      'email':         'E-Mail hat kein gültiges Format.'
    },
    'teamname': {
      'pattern':       'Der Teamname ist ungültig.',
      'required':      'Der Teamname ist verpflichtend.'
    },
    'phone': {
      'required':      'Die Telefonnummer ist verpflichtend.',
      'minlength':     'Die Telefonnummer muss mindestens 10 Zeichen lang sein.',
      'maxlength':     'Die Telefonnummer darf maximal 30 Zeichen lang sein.',
      'pattern':       'Telefonnummer hat kein gültiges Format.'
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
    this.titleService.setTitle("HV TDP Stainz: Kleinfeldturnier 2023")
    this.metaTagService.updateTag({
      name: 'description', content: "Melde dich an für das Kleinfeldturnier des HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      email: ['', [Validators.required, Validators.email] ],
      teamname: ['', [Validators.minLength(1)] ],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30), Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$")] ]
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

    console.log(`send to server: ${this.submittedFeedback.name},
    ${this.submittedFeedback.phone}, ${this.submittedFeedback.email}, ${this.submittedFeedback.teamname}`)

    this.mysqlService.postTurnier(
      this.submittedFeedback.name,
      this.submittedFeedback.email,
      this.submittedFeedback.phone,
      this.submittedFeedback.teamname,
      ).subscribe(result => {
        console.log(`response from server: ${result}`)
    })

    this.feedbackForm.reset({
      name: '',
      email: '',
      phone: '',
      teamname: ''
    })
  }
}
