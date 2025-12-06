import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-boccia',
    templateUrl: './boccia.component.html',
    styleUrls: ['./boccia.component.css'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class BocciaComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  submittedFeedback = null;

  formErrors = {
    name: '',
    teamname: '',
  };

  validationMessages = {
    name: {
      required: 'Die Ansprechperson ist verpflichtend.',
      minlength: 'Die Ansprechperson muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Die Ansprechperson darf maximal 25 Zeichen lang sein.',
    },
    teamname: {
      pattern: 'Der Teamname ist ungültig.',
      required: 'Der Teamname ist verpflichtend.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private metaTagService: Meta,
    private mysqlService: MysqlService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Bocciaturnier 2023');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Melde dich an für das Bocciaturnier des HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      teamname: ['', [Validators.minLength(1)]],
    });

    this.onValueChanged(); // (re)set validation messages now

    this.feedbackForm.valueChanges.subscribe((data) => this.onValueChanged(data));
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
    this.submittedFeedback = this.feedback;

    console.log(`send to server: ${this.submittedFeedback.name},
    ${this.submittedFeedback.phone}, ${this.submittedFeedback.email}, ${this.submittedFeedback.teamname}`);

    this.mysqlService
      .postTurnier(
        this.submittedFeedback.name,
        '', // no mail
        '', // no phone nr.
        this.submittedFeedback.teamname
      )
      .subscribe((result) => {
        console.log(`response from server: ${result}`);
      });

    this.feedbackForm.reset({
      name: '',
      teamname: '',
    });
  }
}
