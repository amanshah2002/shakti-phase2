import { UserType } from 'src/app/shared/enums/user_type.enum';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";
;

import { UserModel } from '../model/User.model';
import { StorageService } from './storage.service';
import { CallAPIService } from '../core/call-api-service.service';
import { error } from 'protractor';
import { UserRoles } from '../shared/enums/user-roles.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  constructor(private http: HttpClient,
    private storage: StorageService, private router: Router,
    private callApiService: CallAPIService,
    private snackbar: MatSnackBar) { }

  private user = new BehaviorSubject<UserModel>(null);
  currentUser = this.user.asObservable();
  admin: boolean;
  UserType = UserType;

  emitQuotationPermission = new BehaviorSubject<boolean>(false)
  quotationPermission = this.emitQuotationPermission.asObservable();
  emitMarketingPermission = new BehaviorSubject<boolean>(false)
  marketingPermission = this.emitMarketingPermission.asObservable();

  signIn(email: string, password: string) {
    return this.callApiService.callPostAPI('login',
      {
        email,
        password
      }
    ).pipe(tap(data => {
      let user = new UserModel(data.data.name,data.data.email, data.data.token, data.data.role.role_id,data.data.user_type,data.data.user_country,data.data.roles);
      this.user.next(user);
    }),
      catchError(error => {
        let errorMsg = "an unknown error occured, please check your internet connection or try again.";
        if (!error.error.message) {
          return throwError(errorMsg);
        }else if(error.error.message == 'There are some errors on your request parameters'){
          errorMsg = 'Please enter your email and password to login.';
          return throwError(errorMsg);
        }
        errorMsg = error.error.message;
        return throwError(errorMsg);
      }));
  }

  logout = () => {
     this.callApiService.callPostAPI('logout',{token:this.user.value.token}).subscribe(data => {
       this.user.next(null);
       this.router.navigate(['/login']).then(()=>location.reload());
       this.storage.removeUser();
     }, catchError(error => {
       return throwError(error);
     }));


  }
  getUser = () => {
    return this.currentUser;
  }

  storeUserData = (user, rememberMe) => {
    if (rememberMe) {
      this.storage.removeUser();
      this.storage.storeInLocal(user);
    } else {
      this.storage.removeUser();
      this.storage.storeInSession(user);
    }
  }

  autoLogin = () => {
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      let User = new UserModel(user.data.name,user.data.email, user.data.token, user.data.role.role_id,user.data.user_type,user.data.user_country,user.data.roles);
      this.user.next(User);
      this.navigateByUserType();
    } else {
      return this.user.next(null);
    }
  }

  navigateByUserType = () => {
   this.currentUser.pipe(tap(data=>{
    if(data.role == UserRoles.Admin){
      return
    }
    if( data.user_type == UserType.All){
      this.router.navigate(['manage-company/all']);
    }
    else if(data.user_type == UserType.Domestic){
      this.router.navigate(['manage-company/domestic']);
    }else{
      this.router.navigate(['manage-company/international']);
    }
   }))
  }

  forgotPassword = (email: string) => {
    return this.callApiService.callPostAPI('resetPassword', { email }).pipe(catchError(error=>{
      throw(error);
    })
    );
  }

  permissionCheck = (quotationPermission,marketingPermission) => {
    this.emitMarketingPermission.next(marketingPermission);
    this.emitQuotationPermission.next(quotationPermission);
  }
}
