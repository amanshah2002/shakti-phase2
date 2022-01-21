import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'shakti-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent implements OnInit {

  displayedContactColumns = ['srNo', 'contactPerson', 'contactNumber', 'e-mail', 'designation'];
  followUpQuotationColumns = ['srNo', 'followUpDate', 'followUpDetails', 'nextFollowUpDate', 'actions'];
  displayedQuotationColumns = ['quotationNo', 'quotationDate', 'companyName', 'basicAmt', 'discountAmt', 'packingCharge', 'taxAmt', 'totalAmt', 'actions']
  id;
  showDelay = new FormControl(500);
  contactDetails: [];
  quotationDetails: [];
  followUpDetails = [];
  statusType = [
    { name: 'Running', value: 1 },
    { name: 'Confirm', value: 2 },
    { name: 'Rejected', value: 2 },
  ]

  partyDetailsForm = new FormGroup({
    partyName: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
  });

  createFollowUpForm = new FormGroup ({
    followUpDetails: new FormControl(),
    nextFollowUpDate: new FormControl(),
    status: new FormControl(),
  })
  constructor() { }

  ngOnInit(): void {
  }

  onSave = () => {

  }

  onListForm = () => {

  }

  onClearForm = () => {
    this.partyDetailsForm.reset()
    this.createFollowUpForm.reset()
  }

}
