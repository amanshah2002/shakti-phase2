import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CallAPIService } from '../core/call-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ItemManagementService {

  item: string = 'Item'
  details: string = 'Details'
  itemDetails: string = 'ItemDetails'
  itemMaster: string = 'ItemMaster'

  constructor(private callApiService: CallAPIService) { }

  createItemDetails = (formValue) => {
    return this.callApiService.callPostAPI(this.itemDetails, formValue)
  }

  getListItemDetails = (itemId) => {
    return this.callApiService.callGetAPI(this.item + '/' + itemId + '/' + this.details)
  }

  getItemDetailsById = (id) => {
    return this.callApiService.callGetAPI(this.item + '/' + id + '/' + this.details + '/' + 1)
  }

  getItemMaster = () => {
    return this.callApiService.callGetAPI(this.itemMaster, {page: 1, perpage: 50})
  }

  createItemMaster = (formValue) => {
    return this.callApiService.callPostAPI(this.itemMaster, formValue)
  }

  getItemMasterById = (id) => {
    return this.callApiService.callGetAPI(this.itemMaster + '/' + id).pipe(map(data => {
      return data.data.item_details
    }))
  }
}
