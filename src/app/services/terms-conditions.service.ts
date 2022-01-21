import { Injectable } from '@angular/core';
import { CallAPIService } from '../core/call-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {

  termsCondition: string = 'TermsCondition';
  terms: string = 'Terms';
  parameter: string= 'Parameter';
  termsParameter: string = "TermsParameter"

  constructor(private callApiService: CallAPIService) { }

  getTermsCondition = () => {
    return this.callApiService.callGetAPI(this.termsCondition, {page: 1, perpage: 50})
  }

  createTermsCondition = (termsCondtion) => {
    return this.callApiService.callPostAPI(this.termsCondition, termsCondtion)
  }

  getTermsConditionById = (id) => {
    return this.callApiService.callGetAPI(this.termsCondition + '/' + id)
  }

  updateTermsConditionById = (id) => {
    return this.callApiService.callPutAPI(this.termsCondition + '/' + id)
  }

  listTermsParameter = (termId) => {
    return this.callApiService.callGetAPI(this.terms + '/' + termId + '/' + this.parameter, {page: 1, perpage: 50})
  }

  getTermsParameterById = (termId, id) => {
    return this.callApiService.callGetAPI(this.terms + '/' + termId + '/' + this.parameter + '/' + id)
  }

  updateTermsParameter = (termId, id) => {
    return this.callApiService.callPutAPI(this.terms + '/' + termId + '/' + this.parameter + '/' + id)
  }

  deleteTermsParameter = (termId, id) => {
    return this.callApiService.callDeleteAPI(this.terms + '/' + termId + '/' + this.parameter + '/' + id)
  }

  createTermsParameter = (termsParameter) => {
    return this.callApiService.callPostAPI(this.termsParameter, termsParameter)
  }
}
