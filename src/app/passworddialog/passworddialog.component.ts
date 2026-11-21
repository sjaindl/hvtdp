import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-passworddialog',
  templateUrl: './passworddialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
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

  submit(form: FormGroup) {
    this.dialogRef.close(`${form.value.password}`);
  }

  cancel() {
    this.dialogRef.close();
  }
}
