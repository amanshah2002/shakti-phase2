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

  constructor(private callApiService: CallAPIService) { }

  getQuotation = () => {
    return this.callApiService.callGetAPI(this.quotation, {page: 1, perpage: 0})
  }

  postQuotation = (quotationFormValue) => {
    return this.callApiService.callPostAPI(this.quotation, quotationFormValue)
  }

  updateQuotation = (quotationFormValue) => {
    return this.callApiService.callPostAPI(this.quotation, quotationFormValue)
  }

  getQuotationById = (quotationId) => {
    return this.callApiService.callGetAPI(`${this.quotation}/${quotationId}`)
  }

  deleteQuotation = (quotationId) => {
    return this.callApiService.callDeleteAPI(this.quotation + '/' + quotationId)
  }
}
