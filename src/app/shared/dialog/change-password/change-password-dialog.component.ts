import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'shakti-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ChangePasswordDialogComponent>) {
    dialogRef.disableClose = true;
  }

  changePassForm = new FormGroup(
    {
      current_password: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
        ),
      ]),
      confirm_password: new FormControl(null, Validators.required),
    },
    this.passCheck.bind(this)
  );

  ngOnInit(): void {}

  passCheck(form: FormGroup) {
    if (form.value.password != form.value.confirm_password) {
      form.controls.confirm_password.setErrors({ passCheck: true });
    } else {
      return null;
    }
  }

  onSubmit = () => {
    this.dialogRef.close({
      data: {
        changePasswordForm: this.changePassForm.value,
      },
    });
  };
}
