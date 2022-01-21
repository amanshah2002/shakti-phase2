import { MatDialog } from '@angular/material/dialog';
import { CompanyVisitService } from './../../../services/company-visit.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'shakti-company-master-table',
  templateUrl: './company-master-table.component.html',
  styleUrls: ['./company-master-table.component.scss']
})
export class CompanyMasterTableComponent implements OnInit {
  companyDetails = []
  id;
  p: number = 1
  totalLength: number
  showDelay = new FormControl(500);
  displayedColumns = ['companyName', 'city', 'state', 'country', 'remarks', 'actions'];
  infoColumns = ['personName', 'contactNumber', 'designation', 'email'];

  constructor(
    private router: Router,
    private companyVisitService: CompanyVisitService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    let param = {
      perpage: 0
    }

    this.companyVisitService.getCompanyList(param).subscribe(response => {
      if(response){
        console.log(response.data.data);
        this.companyDetails = response.data.data
        this.totalLength = this.companyDetails.length
      }
    })
  }

  onAddCompany = (id) => {
    this.router.navigate(['company-visit-details/' + id]);

  }

  onEditItem = (id) => {
    this.router.navigate(['company-visit-details/' + id ]);
  }

  onDeleteItem = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this company. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
      autoFocus: false,
    });
    dialogref.afterClosed().subscribe(data => {
      if(data){
        console.log(id);
      }
    })
  }

  onInfo = (id) => {
    window.alert(this.id)
  }

}
