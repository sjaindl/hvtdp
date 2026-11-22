import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-passworddialog',
  templateUrl: './passworddialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
})
export class PassworddialogComponent {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<PassworddialogComponent>>(MatDialogRef);

  form: FormGroup = this.formBuilder.group({
    password: '',
  });

  submit(form: FormGroup) {
    this.dialogRef.close(`${form.value.password}`);
  }

  cancel() {
    this.dialogRef.close();
  }
}
