import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CallAPIService } from '../core/call-api-service.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private storageService: StorageService, private callApiService: CallAPIService) {
  }
  countryArray = new BehaviorSubject<any>(null);
  countryObs = this.countryArray.asObservable();

  getCountryArray = () => {
    const array = this.storageService.getItem('Country', 'local');
    if (array) {
      this.countryArray.next(array);
    } else {
      this.callApiService.callGetAPI('CountryState/0').subscribe(data => {
        this.countryArray.next(data.data);
        this.storageService.setItem('Country', data.data, 'local');
      });
    }
  }

}
