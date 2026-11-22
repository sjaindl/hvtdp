import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TeamRegistration } from '../shared/feedback';
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
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class BocciaComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private mysqlService = inject(MysqlService);

  feedbackForm!: FormGroup; // built by createForm() in the constructor
  submittedFeedback: TeamRegistration | null = null;

  formErrors: Record<string, string> = {
    name: '',
    email: '',
    teamname: '',
  };

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'Die Ansprechperson ist verpflichtend.',
      minlength: 'Die Ansprechperson muss mindestens 2 Zeichen lang sein.',
      maxlength: 'Die Ansprechperson darf maximal 25 Zeichen lang sein.',
    },
    email: {
      required: 'Die E-Mail-Adresse ist verpflichtend.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    },
    teamname: {
      pattern: 'Der Teamname ist ungültig.',
      required: 'Der Teamname ist verpflichtend.',
    },
  };

  constructor() {
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
      email: ['', [Validators.required, Validators.email]],
      teamname: ['', [Validators.minLength(1)]],
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
    const feedback: TeamRegistration = this.feedbackForm.value;
    this.submittedFeedback = feedback;

    console.log(`send to server: ${feedback.name},
    ${feedback.phone}, ${feedback.email}, ${feedback.teamname}`);

    this.mysqlService
      .postTurnier(
        feedback.name,
        feedback.email,
        '', // no phone nr.
        feedback.teamname
      )
      .subscribe((result) => {
        console.log(`response from server: ${result}`);
      });

    this.feedbackForm.reset({
      name: '',
      email: '',
      teamname: '',
    });
  }
}
