import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyVisitService } from '../services/company-visit.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'shakti-domestic',
  templateUrl: './domestic.component.html',
  styleUrls: ['./domestic.component.scss']
})
export class DomesticComponent implements OnInit {

  companyList = [];
  domesticCompanyList = [];

  constructor(
    private companyVisitService: CompanyVisitService,
  ) {}

  ngOnInit(): void {
  }


}
