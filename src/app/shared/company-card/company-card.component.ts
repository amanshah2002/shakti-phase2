
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { Router } from '@angular/router';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CompanyVisitService } from 'src/app/services/company-visit.service';
import { StorageService } from 'src/app/services/storage.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CardDetailDialogComponent } from '../dialog/card-detail-dialog/card-detail-dialog.component';

@Component({
  selector: 'shakti-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  companyList = [];
  companyTypeFilterList = [];
  @Input() companyType;
  viewAddress: boolean[] = [];
  viewContact: boolean[] = [];
  showCompanies: boolean = false;
  export: boolean = false;
  pageSize: any;
  startIndex: number = 0;
  endIndex: number = 0;
  filterArray = [];
  countryList = [];
  statesObject = {};
  designationObject = {};
  pageSizeOptions: number[] = [50, 100, 150];
  date;
  user;
  @ViewChild('paginatorTop') paginatorTop: ElementRef;

  searchForm = new FormGroup({
    filterName: new FormControl(""),
    filterContactPerson: new FormControl(""),//to be added in backend
    filterPhone: new FormControl(""),//to be added in backend
    filterRemark: new FormControl(""),//to be added in backend
    filterCountry: new FormControl(""),
    filterCity: new FormControl(""),
    filterState: new FormControl(""),
    filterReference: new FormControl(""),
    filterAddress: new FormControl(""),

  });

  constructor(
    private companyVisitService: CompanyVisitService,
    private dialog: MatDialog,
    private storageService: StorageService,
    private router: Router,
    private locationService: LocationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCountryList();
    this.pageSize = this.getPageSize();
    if (!this.pageSize) {
      this.pageSize = 50;
      this.endIndex = 50;
    } else {
      this.endIndex = this.pageSize;
    }
    this.getCompanyList();
    this.companyList.map((company, index) => {
      this.viewAddress[index] = false;
      this.viewContact[index] = false;
    })
  }

  getCountryList = () => {
    this.locationService.countryObs.subscribe(data => {
      if (data) {
        this.countryList = data;
        this.parseCountry(data);
      }
    });
  }



  getCompanyList = () => {
    let type;
    let country;
    this.authService.currentUser.subscribe(data => {
      if (data) {
        this.user = data;
        type = +data.user_type;
        country = +data.user_country
      }
    });
    let param = {
      perpage: 0,
      type: this.companyType
    }
    if (this.companyType == 6) {
      param['filterCountry'] = country;
      param['type'] = '';
    }
    this.companyVisitService.getCompanyList(param).subscribe(data => {
      this.showCompanies = true;
      if (data) {
        this.companyList = data.data.data;
        this.companyTypeFilterList = data.data.data;
        this.companyList.sort((a, b) => a.created_at > b.created_at ? -1 : 1)
        this.setViewBooleanTrue();
        this.filterArray = this.companyTypeFilterList.slice(0, this.endIndex);
      }
    }, error => {
      this.companyVisitService.snackbarOpen('An unknown error occurred while retrieving the company list, please check your internet connection or try again.');
    }
    )
  }

  setViewBooleanTrue = () => {
    for (let i = 0; i < this.companyList.length; i++) {
      this.viewAddress.push(true);
      this.viewContact.push(true);

    }
  }

  parseCountry = (countryList) => {
    countryList.map(country => {
      this.statesObject[country.id] = {
        phoneCode: '+' + country.phonecode,
        state: country.states

      },
        this.designationObject[country.id] = {
          desination: ''
        }
    })
  }

  getPageSize = () => {
    return this.storageService.getItem('pageSizeAll', 'local');
  }


  onPageChange = (event: PageEvent) => {
    this.pageSize = event.pageSize;
    this.storageService.setItem('pageSizeAll', this.pageSize, 'local');
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.filterArray = this.companyTypeFilterList.slice(this.startIndex, this.endIndex);//will be used in onSearch
    const element = document.querySelector('#cardTop');
    element.scrollIntoView();
  }

  onRemoveCompany = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this company. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
      autoFocus: false,
    });
    dialogref.afterClosed().subscribe((data) => {
      if (data) {
        this.companyVisitService.removeCompany(id).subscribe(data => {
          if (data) {
            this.getCompanyList();
            if (this.companyList) {
              this.dialog.open(CardDetailDialogComponent, { data: { action: 'Deleted!', content: 'Company has been deleted' } });
            }
          }
        }, error => {
          this.companyVisitService.snackbarOpen('Could not delete company due to an unknown error.')
        });

      } else {
        return;
      }
    });
  };

  onToggleAddress = (index) => {
    this.viewAddress[index] = !this.viewAddress[index];
  }

  onToggleContact = (index) => {
    this.viewContact[index] = !this.viewContact[index];
  }


  onSearch = () => {
    let searchFormValue = this.searchForm.value;
    Object.keys(searchFormValue).map(formKey => {
      searchFormValue[formKey] ? null : delete searchFormValue[formKey]
    })
    searchFormValue['perpage'] = 0;
    searchFormValue['type'] = this.companyType;

    this.companyVisitService.getFilteredCompany(searchFormValue).subscribe(data => {
      if (data) {
        this.companyList = data.data.data;
        this.companyTypeFilterList = data.data.data;
        this.companyList.sort((a, b) => a.created_at > b.created_at ? -1 : 1)
        // this.checkCompanyType();
        this.filterArray = this.companyTypeFilterList.slice(0, this.endIndex);
      } else {
        this.filterArray = [];
      }
    });
  }

  onExport = () => {
    this.companyVisitService.getCSVFile().subscribe(response => {
      let myBlob = new Blob([response], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
      let downloadUrl = URL.createObjectURL(myBlob);

      let a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'pharma_entries.csv';
      a.dispatchEvent(new MouseEvent('click'));

      setTimeout(() => {
        URL.revokeObjectURL.bind(URL, downloadUrl);
      }, 100);
    })
  }

  onSearchClear = () => {
    this.searchForm.reset();
    const form = this.searchForm.controls;
    const filterForm = {
      filterName: '',
      type: this.companyType,
    }
    this.companyVisitService.getFilteredCompany(filterForm).subscribe(data => {
      this.companyList = data.data.data;
      this.companyTypeFilterList = data.data.data;
      this.companyList.sort((a, b) => a.created_at > b.created_at ? -1 : 1)
      // this.checkCompanyType();
      this.filterArray = this.companyTypeFilterList.slice(this.startIndex, this.endIndex);
    });

  }

  redirectByCompanyType = (id) => {
    this.router.navigate(['/company-visit-details/' + id]);
  }

  onClearField = (fieldName) => {
    const form = this.searchForm.controls;
    switch (fieldName) {
      case 'filterName': form.filterName.setValue('');
        break;
      case 'filterCountry': form.filterCountry.setValue('');
        break;
      case 'filterPhone': form.filterPhone.setValue('');
        break;
      case 'filterRemark': form.filterRemark.setValue('');
        break;
      case 'filterState': form.filterState.setValue('');
        break;
      case 'filterCity': form.filterCity.setValue('');
        break;
      case 'filterContactPerson': form.filterContactPerson.setValue('');
        break;
      case 'filterReference': form.filterReference.setValue('');
        break;
      case 'filterAddress': form.filterAddress.setValue('');
        break;
    }
    this.onSearch();
  }

  onIsStateDisable = () => {
    return this.searchForm.value.filterCountry?.length > 1;
  }
}


