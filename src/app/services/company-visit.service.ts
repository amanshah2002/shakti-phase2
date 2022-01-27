
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallAPIService } from '../core/call-api-service.service';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyVisitService {
  companyList = [];
  companyEmitter = new BehaviorSubject<any>(null);
  companyEmitterObs = this.companyEmitter.asObservable();

  contactType = [{ label: 'Landline', value: 1 }, { label: 'Personal', value: 2 }, { label: 'Office', value: 3 }]
  searchForm = {};
  constructor(private callApiService: CallAPIService, private snackbar: MatSnackBar) { }

  snackbarOpen = (message: string) => {
    this.snackbar.open(message, 'Dismiss', { verticalPosition: 'top', horizontalPosition: 'center', duration: 4000 });
  }

  saveCompany = (companyData) => {
    return this.callApiService.callPostAPI('company', companyData).pipe(
      catchError(error => {
        return throwError(error);
      })
    )
  }

  removeCompany = (id: number) => {
    return this.callApiService.callDeleteAPI('company/' + id).pipe(catchError(error => {
      throw (error);
    }));
  }

  fetchCompanyById = (id: number) => {
    return this.callApiService.callGetAPI('company/' + id).pipe(catchError(error => {
      throw (error);

    }))
  }

  editCompany = (editForm, id) => {
    return this.callApiService.callPutAPI('company/' + id, null, editForm).pipe(catchError(error => {
      throw (error);
    }))
  }

  getCompanyList = (param?) => {
    return this.callApiService.callGetAPI('company', param).pipe(catchError(error => {
      throw (error);
    }));
  }

  getFilteredCompany = (form) => {
    this.searchForm = form;
    if (this.searchForm['filterCountry']) {
      const spreadFilterCountry = this.searchForm['filterCountry'].join(',');
      this.searchForm['filterCountry'] = spreadFilterCountry
      console.log("CompanyVisitService ~  this.searchForm['filterCountry']",  this.searchForm['filterCountry']);
    }
    return this.callApiService.callGetAPI('company', form).pipe(catchError(error => {
      throw (error);
    }));
  }

  emitCompany = (companyType) => {
    this.companyEmitter.next(companyType);
  }

  getCSVFile = () => {
    this.searchForm['isExportRow'] = 'yes';
    return this.callApiService.callGetCSVAPI('company', this.searchForm);
  }
}
