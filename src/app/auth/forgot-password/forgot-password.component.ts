import { catchError, tap } from 'rxjs/operators';
import { CallAPIService } from './../../core/call-api-service.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'shakti-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(private router: Router, private snackbar: MatSnackBar, private callApiService : CallAPIService) {}
  forgotPassForm = new FormGroup(
    {
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
        ),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
        ),
      ]),
      code: new FormControl(null,Validators.required)
    },
    this.passCheck.bind(this)
  );
  ngOnInit(): void {}

  callResetPassword = (form) => {
    return this.callApiService.callPostAPI('updatePassword',form).pipe(catchError(error=>{
      let errorMsg = 'An unknown error occurred.';
      if(!error.error.message){
        throw(errorMsg);
      }
      errorMsg = error.error.message
      throw(errorMsg);
    }));
  }

  onForgotPassword = () => {
    const password = this.forgotPassForm.controls.password.value;
    const confirmPassword = this.forgotPassForm.controls.confirmPassword.value;
    if (password == confirmPassword) {
      const updatePass = {
        code : this.forgotPassForm.value.code,
        password : this.forgotPassForm.value.password,
        confirm_password : this.forgotPassForm.value.confirmPassword
      };
      this.callResetPassword(updatePass).subscribe(data=>{
        if(data){
          this.snackbar.open('Password updated successfully','Dismiss',{duration:4000,verticalPosition:'top'});
        }
      },errorMsg=>{
        this.snackbar.open(errorMsg,'dismiss',{duration:4000,verticalPosition:"top"});
      });
      // this.router.navigate(['/login']);
    } else {
      this.snackbar.open('Passwords do not match!', 'dismiss', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000,
      });
    }
  };
  passCheck(form: FormGroup) {
    if (form.value.password != form.value.confirmPassword) {
      form.controls.confirmPassword.setErrors({ passCheck: true });
    } else {
      return null;
    }
  }
}
