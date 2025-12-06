import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-passworddialog',
    templateUrl: './passworddialog.component.html',
    styleUrls: ['./passworddialog.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class PassworddialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PassworddialogComponent>
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: '',
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.password}`);
  }
}
