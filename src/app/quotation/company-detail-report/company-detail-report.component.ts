import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shakti-company-detail-report',
  templateUrl: './company-detail-report.component.html',
  styleUrls: ['./company-detail-report.component.scss']
})
export class CompanyDetailReportComponent implements OnInit {

  companyDetails = []
  companyDetailsColumns =['partyName', 'address', 'area', 'city', 'state', 'country', 'contactPerson', 'contactNumber', 'email']
  constructor() { }

  ngOnInit(): void {
  }

}
