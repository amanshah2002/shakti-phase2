import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyVisitService } from '../services/company-visit.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'shakti-international',
  templateUrl: './international.component.html',
  styleUrls: ['./international.component.scss']
})
export class InternationalComponent implements OnInit {


  companyList = [];
  internationalCompanyList = [];

  constructor(
    private companyVisitService: CompanyVisitService
  ) { }

  ngOnInit(): void {
  }


}
