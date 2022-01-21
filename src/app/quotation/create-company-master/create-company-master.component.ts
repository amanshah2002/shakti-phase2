import { LocationService } from './../../services/location.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { country } from 'src/app/interfaces/interfaces.component';

@Component({
  selector: 'shakti-create-company-master',
  templateUrl: './create-company-master.component.html',
  styleUrls: ['./create-company-master.component.scss']
})
export class CreateCompanyMasterComponent implements OnInit {

  countryList = [];
  stateObject = {};

  masterCompanyForm = new FormGroup({
    company_name: new FormControl(),
    company_type: new FormControl(),
    billing_address: new FormControl(),
    plant_address: new FormControl(),
    area: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    state: new FormControl(),
    gst_number: new FormControl(),
    remarks: new FormControl(),
  });

  personDetailsForm = new FormGroup({
    person_name: new FormControl(),
    person_contact_number: new FormControl(),
    designation: new FormControl(),
    email: new FormControl(),
  });

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList = () => {
    this.locationService.countryObs.subscribe((data) => {
      if (data) {
        this.countryList = data;
        this.parseCountry(data);
      }
    });
  };

  parseCountry = (countryArray) => {
    countryArray.map((country: country) => {
      this.stateObject[country.id] = {
        states: country.states,
        phoneCode: country.phoneCode,
      };
    });
    // console.log(this.stateObject[1].states);
  };

  onAdd = () => {

  }

  onUpdateForm = () => {

  }

  onClearForm = () => {
    this.masterCompanyForm.reset()
    this.personDetailsForm.reset()
  }
}
