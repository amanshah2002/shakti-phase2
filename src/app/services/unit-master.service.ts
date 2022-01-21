import { Injectable } from '@angular/core';
import { CallAPIService } from '../core/call-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UnitMasterService {

  unitMaster: string = 'unitMaster'

  constructor(private callAPIService: CallAPIService) { }

  getUnitMasterList = () => {
    return this.callAPIService.callGetAPI(this.unitMaster, {page: 1, perpage:50})
  }

  createUnitMaster = (formValue) => {
    return this.callAPIService.callPostAPI(this.unitMaster, formValue)
  }

  getUnitDetailsById = (id) => {
    return this.callAPIService.callGetAPI(this.unitMaster + '/' + id)
  }

  updateUnitDetails = (id, formValue) => {
    return this.callAPIService.callPutAPI(`unitMaster/${id}`, formValue)
  }
}
