import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-passworddialog',
  templateUrl: './passworddialog.component.html',
  styleUrls: ['./passworddialog.component.css'],
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
