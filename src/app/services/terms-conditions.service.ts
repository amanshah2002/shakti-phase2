import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { CallAPIService } from '../core/call-api-service.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {

  termsCondition: string = 'TermsCondition';
  terms: string = 'Terms';
  parameter: string= 'Parameter';
  termsParameter: string = "TermsParameter"

  constructor(
    private callApiService: CallAPIService,
    private snackbar: MatSnackBar) { }

  getTermsCondition = () => {
    return this.callApiService.callGetAPI(this.termsCondition, {page: 1, perpage: 50}).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  createTermsCondition = (termsCondtion) => {
    return this.callApiService.callPostAPI(this.termsCondition, termsCondtion).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  getTermsConditionById = (id) => {
    return this.callApiService.callGetAPI(this.termsCondition + '/' + id).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  updateTermsConditionById = (id) => {
    return this.callApiService.callPutAPI(this.termsCondition + '/' + id).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  listTermsParameter = (termId) => {
    return this.callApiService.callGetAPI(this.terms + '/' + termId + '/' + this.parameter, {page: 1, perpage: 50}).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  getTermsParameterById = (termId, id) => {
    return this.callApiService.callGetAPI(this.terms + '/' + termId + '/' + this.parameter + '/' + id).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  updateTermsParameter = (termId, id) => {
    return this.callApiService.callPutAPI(this.terms + '/' + termId + '/' + this.parameter + '/' + id).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  deleteTermsParameter = (termId, id) => {
    return this.callApiService.callDeleteAPI(this.terms + '/' + termId + '/' + this.parameter + '/' + id).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  createTermsParameter = (termsParameter) => {
    return this.callApiService.callPostAPI(this.termsParameter, termsParameter).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  handleError = (error) => {
    console.log(error);
    let errorMsg = "An unknown error occurred, please check your internet connection or try again";
    if(error.error.message){
      errorMsg = error.error.message
      if(error.error.errors){
        const errors = error.error.errors[0]
        Object.keys(errors).map(keys => {
          errorMsg = errors[keys];
        })
      }
    }
    return errorMsg;
  }

  displaySnackBar = (message:string) => {
    this.snackbar.open(message,'Dismiss',{verticalPosition:'top',duration: 5000});
  }
}
