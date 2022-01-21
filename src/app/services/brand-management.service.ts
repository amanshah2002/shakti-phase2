import { CallAPIService } from './../core/call-api-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrandManagementService {

  brandMaster: string = 'BrandMaster'
  constructor(private callAPIService: CallAPIService) { }

  getBrandMasterList = () => {
    return this.callAPIService.callGetAPI(this.brandMaster, {page: 1, perpage:50})
  }

  createBrandMaster = (formValue) => {
    return this.callAPIService.callPostAPI(this.brandMaster, formValue)
  }

  getBrandDetailsById = (id) => {
    return this.callAPIService.callGetAPI(this.brandMaster + '/' + id)
  }

  updateBrandDetails = (id, formValue) => {
    return this.callAPIService.callPutAPI(`BrandMaster/${id}`, formValue)
  }
}
