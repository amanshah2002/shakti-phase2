import { AuthService } from './../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CompanyVisitService } from './../../../services/company-visit.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';

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
  companySortKey = ['company_name', 'state.name', 'city', 'country.name', 'company.remarks'];
  companySortObject = {};
  filterData = []
  searchKeys = ['company_name', 'state.name', 'city', 'country.name', 'company.remarks'];
  isDataReceived:boolean = false;
  isMarketing:boolean = false;

  constructor(
    private router: Router,
    private companyVisitService: CompanyVisitService,
    private dialog: MatDialog,
    private authService: AuthService) { }

  ngOnInit(): void {
    let param = {
      perpage: 0
    }

    this.getCompanyPermission();

    this.companyVisitService.getCompanyList(param).subscribe(response => {
      if (response) {
        console.log(response.data.data);
        this.isDataReceived = true;
        this.companyDetails = response.data.data
        this.filterData = this.companyDetails
        this.totalLength = this.filterData?.length
      }
    });
    this.initializeSortKeys();
  }

  getCompanyPermission = () => {
    this.authService.marketingPermission.subscribe(permission => {
      this.isMarketing = permission
    })
  }

  onAddCompany = () => {
    this.router.navigate(['company-visit-details/domestic']);

  }

  onEditItem = (id) => {
    this.router.navigate(['company-visit-details/' + id]);
  }

  onDeleteItem = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this company. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
      autoFocus: false,
    });
    dialogref.afterClosed().subscribe(data => {
      if (data) {
        console.log(id);
      }
    })
  }

  onInfo = (id) => {
    window.alert(this.id)
  }

  onSearch = (searchString) => {
    this.filterData = []
    if(searchString == ''){
      console.log(searchString);
      this.filterData = this.companyDetails;
      this.totalLength = this.filterData.length;
      return
    }
    this.searchKeys.map(keys => {
      // this.filterData = this.itemData.filter((a:any) => a[keys].toString().toLowerCase().includes(searchString.toLowerCase()))
      this.companyDetails.map((data:any) => {
          if(data[keys]?.toString().toLowerCase().includes(searchString.toLowerCase())){
            if(this.filterData.indexOf(data) === -1 ){
              this.filterData.push(data);
            }
          }
      })
    })
    this.totalLength = this.filterData.length;
    console.log(this.filterData);
  }

  initializeSortKeys = () => {
    this.companySortKey.map(keys => {
      this.companySortObject[keys] = {
        sortState: false
      }
    })
  }


  onSort = (sortString: string) => {
    this.companySortObject[sortString].sortState = !this.companySortObject[sortString].sortState;
    if (sortString == 'company_name') {
      this.companySortObject[sortString].sortState ? this.companyDetails.sort((a, b) => a[sortString] > b[sortString] ? 1 : -1) :
        this.companyDetails.sort((a, b) => a[sortString] < b[sortString] ? 1 : -1);
    }

    else if (sortString == 'company.remarks') {
      this.companySortObject[sortString].sortState ? this.companyDetails.sort((a, b) => a.company?.remarks > b.company?.remarks ? 1 : -1) :
        this.companyDetails.sort((a, b) => a.company?.remarks < b.company?.remarks ? 1 : -1);
    }

    else if (sortString == 'city') {
      this.companySortObject[sortString].sortState ? this.companyDetails.sort((a, b) => a.address[0].city > b.address[0].city ? 1 : -1) :
        this.companyDetails.sort((a, b) => a.address[0].city < b.address[0].city ? 1 : -1);
    }

    else if (sortString == 'state.name') {
      this.companySortObject[sortString].sortState ? this.companyDetails.sort((a, b) => a.address[0].state.name > b.address[0].state.name ? 1 : -1) :
        this.companyDetails.sort((a, b) => a.address[0].state.name < b.address[0].state.name ? 1 : -1);
    }

    else if (sortString == 'country.name') {
      this.companySortObject[sortString].sortState ? this.companyDetails.sort((a, b) => a.address[0].country.name > b.address[0].country.name ? 1 : -1) :
        this.companyDetails.sort((a, b) => a.address[0].country.name < b.address[0].country.name ? 1 : -1);
    }
  }
}
