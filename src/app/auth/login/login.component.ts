import { UserRoles } from './../../shared/enums/user-roles.enum';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordDialogComponent } from '../forgot-password/forgot-password-dialog.component';
import { error } from 'protractor';
import { ChangePasswordDialogComponent } from 'src/app/shared/dialog/change-password/change-password-dialog.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
@Component({
  selector: 'shakti-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    Email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,63}$'),
    ]),
    password: new FormControl(null, [
      Validators.required,
      // Validators.pattern(
      //   '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      // ),
    ]),
  });

  visible: boolean = false;
  type: string = 'password';
  rememberMe: boolean = false;
  login = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private resetpassDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.snackbar.dismiss();
  }

  quotationPermission:boolean = false
  marketingPermission:boolean = false

  showPermissionDialog = () => {
    this.authService.quotationPermission.subscribe(permission => {
      this.quotationPermission = permission
    });
    this.authService.marketingPermission.subscribe(permission => {
      this.marketingPermission = permission
    });
    if(this.quotationPermission && this.marketingPermission){
      const dialogref = this.resetpassDialog.open(DialogComponent, {
        data: { header: 'Where do you want to go?', content: 'Do you want to stay on marketing or do to quotations?', yesBtn: 'Stay in marketing', noBtn: 'Go to quotations' },
        autoFocus: false,
      });
      dialogref.afterClosed().subscribe(data => {
        if(data){
          return
        }
        this.router.navigate(['phase2/quotation-table/domestic']);
      })
    }
  }

  onLogin() {
    const email = this.loginForm.value.Email;
    const password = this.loginForm.value.password;
    this.authService.signIn(email, password).subscribe(
      (data) => {
        this.showPermissionDialog();
        this.authService.storeUserData(data, this.rememberMe);
        this.snackbar.dismiss();
        if( data.data.role.role_id=UserRoles.Admin){
          this.router.navigate(['/users'])
          return
        }
        this.navigateByUsertype(data.data.user_type);
      },
      (errorMsg) => {
        this.snackbar.open(errorMsg, 'dismiss', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 4000,
        });
      }
    );
  }

  navigateByUsertype = (userType) => {
    if(userType == '5'){
      this.router.navigate(['manage-company/all']);
    }
    else if(userType == '6'){
      this.router.navigate(['manage-company/domestic']);
    }else{
      this.router.navigate(['manage-company/international']);
    }
  }

  onPasswordToggle() {
    this.visible = !this.visible;
    this.visible ? (this.type = 'text') : (this.type = 'password');
  }

  onRemember = (data) => {
    this.rememberMe = data;
  };
  onForgotPassword = () => {
    const dialogRef = this.resetpassDialog.open(ForgotPasswordDialogComponent);
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.authService.forgotPassword(data).subscribe(data=>{
          this.snackbar.open("Password reset email sent successfully , please check your Email",'Dismiss',{verticalPosition:'top',duration:4000});
          this.router.navigate(['/forgot-password/123']);
        },
        (error)=>{
          let errorMsg = "An unknown error occurred , please check your internet connection or try again.";
          if(!error.error){
            this.snackbar.open(errorMsg,'Dismiss',{verticalPosition:'top',duration:4000});
            return
          }else if(error.error){
            errorMsg = error.error.message;
          }
          this.snackbar.open(errorMsg,'Dismiss',{verticalPosition:'top',duration:4000});
        });
      }
    });
    // const dialogRef = this.resetpassDialog.open(ChangePasswordDialogComponent);
  };
}
