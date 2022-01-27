import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CallAPIService } from '../core/call-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userData = []
  userTypeArray = [
    { label: 'All', value: 5 }, { label: 'Domestic', value: 6 }, { label: 'International', value: 7 }
  ];

  companyTypeArray = [
    { label: 'Domestic', value: 6 }, { label: 'International', value: 7 }
  ];

  userRoleArray = [
    { label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }
  ];

  pemrissionsArray = [{ label: 'Marketing', value: 1 }, { label: 'Quotation', value: 2 }];

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private callApiService: CallAPIService) { }

  addUserData = (userdataArray) => {
    return this.callApiService.callPostAPI('register', {
      name: userdataArray.Name,
      email: userdataArray.email,
      password: userdataArray.password,
      confirm_password: userdataArray.confirmPassword,
      phone: userdataArray.Phone_Number,
      role: userdataArray.Role,
      user_type: userdataArray.userType,
      user_country: userdataArray.Country,
      permission: userdataArray.permission

    }).pipe(catchError(error => {
      throw (error);
    }));
  }

  removeUser = (id) => {
    return this.callApiService.callDeleteAPI('user/' + id).pipe(catchError(error => {
      throw (error);
    }));
  }

  findUserById = (index) => {
    return this.callApiService.callGetAPI('user/' + index).pipe(catchError(error => {
      throw (error);
    }));
  }

  onUpdateUser = (id, userArray) => {
    console.log(userArray.permission);

    return this.callApiService.callPutAPI('user/' + id, {
      name: userArray.Name,
      email: userArray.email,
      phone: userArray.Phone_Number,
      user_type: userArray.userType,
      user_country: userArray.Country,
      status: 1,
      permission: userArray.permission

    }).pipe(catchError(error => {
      throw (error);
    }));
  }

  fetchUserData = () => {
    return this.callApiService.callGetAPI('user', { perpage: 0 }).pipe(catchError(error => {
      throw (error);
    }));
  }

  siteStatic = () => {
    return this.callApiService.callGetAPI('siteStatic');
  }
}
