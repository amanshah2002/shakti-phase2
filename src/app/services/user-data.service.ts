import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError} from 'rxjs/operators';
import { CallAPIService } from '../core/call-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userData = []
  pemrissionsArray = [{ label: 'Marketing', value: 1 }, { label: 'Quotation', value: 2 }];
  userTypeArray = [
    { label: 'All', value: 5 }, { label: 'Domestic', value: 6 }, { label: 'International', value: 7 }
  ];
  companyTypeArray = [
    { label: 'Domestic', value: 6 }, { label: 'International', value: 7 }
  ];
  userRoleArray = [
    { label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }
  ];
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private callApiService: CallAPIService) { }

  addUserData = (userdataArray) => {
    return this.callApiService.callPostAPI('register', {
      name: userdataArray.value.Name,
      email: userdataArray.value.email,
      password: userdataArray.value.password,
      confirm_password: userdataArray.value.confirmPassword,
      phone: userdataArray.value.Phone_Number,
      role: userdataArray.value.Role,
      user_type: userdataArray.value.userType,
      user_country: userdataArray.value.Country,
      permission: [{id:1}]
    }).pipe(catchError(error=>{
      throw(error);
    }));
  }//Aman shah: move this code to component
  removeUser = (id) => {
    return this.callApiService.callDeleteAPI('user/' + id).pipe(catchError(error=>{
      throw(error);
    }));
  }
  findUserById = (index) => {
    return this.callApiService.callGetAPI('user/' + index).pipe(catchError(error=>{
      throw(error);
    }));
  }
  onUpdateUser = (id, userArray) => {
    return this.callApiService.callPutAPI('user/' + id, {
      name: userArray.value.Name,
      email: userArray.value.email,
      phone: userArray.value.Phone_Number,
      user_type: userArray.value.userType,
      user_country: userArray.value.Country,
      status: 1,
      permission: [{id:1}]
    }).pipe(catchError(error=>{
       throw(error);
    }));
  }


    fetchUserData=()=>{
      return this.callApiService.callGetAPI('user',{perpage:0}).pipe(catchError(error=>{
        throw(error);
      }));
    }

    siteStatic = () => {
      return this.callApiService.callGetAPI('siteStatic');
    }
}
