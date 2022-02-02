import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { item } from './../interfaces/interfaces.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { CallAPIService } from '../core/call-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  // tableItemArray = new BehaviorSubject<item[]>(null)-
  quotation: string = 'quotation';

  constructor(
    private callApiService: CallAPIService,
    private snackbar: MatSnackBar) { }

  getQuotation = () => {
    return this.callApiService.callGetAPI(this.quotation, {page: 1, perpage: 0}).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  postQuotation = (quotationFormValue) => {
    return this.callApiService.callPostAPI(this.quotation, quotationFormValue).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  updateQuotation = (quotationFormValue) => {
    return this.callApiService.callPostAPI(this.quotation, quotationFormValue).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  getQuotationById = (quotationId) => {
    return this.callApiService.callGetAPI(`${this.quotation}/${quotationId}`).pipe(catchError(error => {
      const errorMsg = this.handleError(error);
      throw(errorMsg);
    }))
  }

  deleteQuotation = (quotationId) => {
    return this.callApiService.callDeleteAPI(this.quotation + '/' + quotationId).pipe(catchError(error => {
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
