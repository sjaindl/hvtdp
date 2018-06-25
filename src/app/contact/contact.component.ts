import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { MatFormField } from '@angular/material';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  title: string = '1. HVTDP';
  lat: number = 46.899395
  lng: number = 15.248251;
  zoom: number = 15;

  feedbackForm: FormGroup;
  feedback: Feedback;
  submittedFeedback = null;
  contactType = ContactType;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'Vorname ist verpflichtend.',
      'minlength':     'Der Vorname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Vorname darf maximal 25 Zeichen lang sein.'
    },
    'lastname': {
      'required':      'Nachname ist verpflichtend.',
      'minlength':     'Der Nachname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Nachname darf maximal 25 Zeichen lang sein.'
    },
    'telnum': {
      'required':      'Die Telefonnummer ist verpflichtend.',
      'pattern':       'Telefonnummer darf nur Ziffern enthalten.'
    },
    'email': {
      'required':      'Die E-Mail ist verpflichtend.',
      'email':         'E-Mail hat kein gültiges Format.'
    },
  };

  constructor(private formBuilder: FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.onValueChanged(); // (re)set validation messages now

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
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
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);

    // this.feedbackService.submitFeedback(this.feedback)
    //   .subscribe(feedback => { 
        this.submittedFeedback = this.feedback;
      // });

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

}
