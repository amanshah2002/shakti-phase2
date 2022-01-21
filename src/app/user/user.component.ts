import { CardDetailDialogComponent } from './../shared/dialog/card-detail-dialog/card-detail-dialog.component';
import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from "@angular/material/paginator";

import { DialogComponent } from '../shared/dialog/dialog.component';
import { UserDataService } from '../services/user-data.service';
import { LocationService } from '../services/location.service';
import {  HttpClient } from "@angular/common/http";

@Component({
  selector: 'shakti-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private userDataService: UserDataService, private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private locationService: LocationService,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private http: HttpClient) {
  }

  filterArray = [];
  mapUser = {};
  userData = [];
  pCode = [];
  phoneCode = [];
  pageSizeOptions: number[] = [3, 5, 10];
  userDataReceived: boolean = false;
  nameSort: boolean;
  roleSort: boolean;
  userTypeSort: boolean;
  emailSort: boolean;
  countrySort: boolean;
  phoneSort: boolean;
  isChecked: boolean[] = [];
  pageSize;
  startIndex = 0;
  endIndex = 0;
​

  ngOnInit(): void {
    this.userDataService.siteStatic().subscribe(data=>{
    })
    this.locationService.countryObs.subscribe(data => {
      if (data) {
        this.phoneCode = data;
      }
    });
    this.pageSize = this.getPageSize();
    if (!this.pageSize) {
      this.pageSize = 10;
      this.endIndex = 10;
    } else {
      this.endIndex = this.pageSize;
    }
    this.snackbar.dismiss();
    this.userDataService.fetchUserData().subscribe(response => {
      if (response.data) {
        this.userData = response.data.data;
        this.userDataReceived = true;
        this.userArrayMap(this.userData);
        this.filterArray = this.userData.slice(0, this.endIndex);//will be used in onSearch
        this.initializeToggleSlider(this.userData);
      }
    }, error => {
      this.snackbar.open('An unknown error occurred while retrieving user list, please check your internet connection or try again','Dismiss',{duration:4000,verticalPosition:'top'});
    })
  }
  initializeToggleSlider(userData: any[]) {
    for (let i = 0; i < userData.length; i++) {
      this.isChecked[i] = true;
    }
  }

  getUserData = () => {
    this.userDataService.fetchUserData().subscribe(response => {
      if (response.data) {
        this.userData = response.data.data;
        this.filterArray = this.userData.slice(this.startIndex, this.endIndex);//will be used in onSearch
        this.userDataReceived = true;
      }
    }, error => {
      this.snackbar.open('An unknown error occurred while retrieving user list, please check your internet connection or try again','Dismiss',{duration:4000,verticalPosition:'top'});

    })
  }

  userArrayMap = (userList:any[]) => {
    userList.map(user=>{
      this.mapUser[user.id] = {
        status : +user.status
      }
    });
  }

  onRemovePerson = (id) => {
    const dialogRef = this.dialog.open(DialogComponent, { data: { header: 'Delete this User', content: 'If you proceed, you will loose all your data for this user. Are you sure you want to delete?', yesBtn: 'Yes,delete it!', noBtn: 'No, cancel it!' }, autoFocus: false })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.userDataService.removeUser(id).subscribe(data => {
          if (data) {
            this.getUserData();
            if (this.userData) {
              this.dialog.open(CardDetailDialogComponent, { data: { action: 'Deleted', content: 'User has been deleted' } })
            }
          }
        },error=>{
          this.snackbar.open('Could not delete user due to an unknown error','Dismiss',{duration:4000,verticalPosition:'top'});
        });
      }
    });
  }

  getPageSize = () => {
    return this.storageService.getItem('pageSize', 'local');
  }

  onEdit(index) {
    this.router.navigate(['user-detail/', index], { relativeTo: this.activeRoute });
  }

  onPageChange = (event: PageEvent) => {
    this.pageSize = event.pageSize;
    this.storageService.setItem('pageSize', this.pageSize, 'local');
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.filterArray = this.userData.slice(this.startIndex, this.endIndex);//will be used in onSearch
  }

  onSearch = (value) => {
    if (value == "") {
      if (this.startIndex != 0 && this.endIndex != 0) {
        this.filterArray = this.userData.slice(this.startIndex, this.endIndex);
        return
      } else {
        this.filterArray = this.userData.slice(0, this.pageSize);
        return
      }
    }
    this.filterArray = this.userData.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
  }

  onSortHeader = (sortString: string) => {
    if (sortString == '' || !sortString) {
      return
    }
    if (sortString == 'name') {
      this.nameSort = !this.nameSort;
      this.nameSort ? this.userData.sort((a, b) => a.name > b.name ? 1 : -1) :
        this.userData.sort((a, b) => a.name > b.name ? -1 : 1);
      this.roleSort = false;
      this.userTypeSort = false;
      this.emailSort = false;
      this.countrySort = false;
      this.phoneSort = false;
    }
    if (sortString == 'role') {
      this.roleSort = !this.roleSort;
      this.roleSort ? this.userData.sort((a, b) => a.role.role_id > b.role.role_id ? 1 : -1) :
        this.userData.sort((a, b) => a.role.role_id > b.role.role_id ? -1 : 1);
      this.nameSort = false;
      this.userTypeSort = false;
      this.emailSort = false;
      this.countrySort = false;
      this.phoneSort = false;

    }
    if (sortString == 'user-type') {
      this.userTypeSort = !this.userTypeSort;
      this.userTypeSort ? this.userData.sort((a, b) => a.user_type.label > b.user_type.label ? 1 : -1) :
        this.userData.sort((a, b) => a.user_type.label > b.user_type.label ? -1 : 1);
      this.nameSort = false;
      this.roleSort = false;
      this.emailSort = false;
      this.countrySort = false;
      this.phoneSort = false;
    }
    if (sortString == 'email') {
      this.emailSort = !this.emailSort;
      this.emailSort ? this.userData.sort((a, b) => a.email > b.email ? 1 : -1) :
        this.userData.sort((a, b) => a.email > b.email ? -1 : 1);
      this.nameSort = false;
      this.roleSort = false;
      this.userTypeSort = false;
      this.countrySort = false;
      this.phoneSort = false;
    }
    if (sortString == 'country') {
      this.countrySort = !this.countrySort;
      this.countrySort ? this.userData.sort((a, b) => a.user_country.name > b.user_country.name ? 1 : -1) :
        this.userData.sort((a, b) => a.user_country.name > b.user_country.name ? -1 : 1);
      this.nameSort = false;
      this.roleSort = false;
      this.userTypeSort = false;
      this.emailSort = false;
      this.phoneSort = false;
    }
    if (sortString == 'phone') {
      this.phoneSort = !this.phoneSort;
      this.phoneSort ? this.userData.sort((a, b) => a.phone > b.phone ? 1 : -1) :
        this.userData.sort((a, b) => a.phone > b.phone ? -1 : 1);
      this.nameSort = false;
      this.roleSort = false;
      this.userTypeSort = false;
      this.emailSort = false;
      this.countrySort = false;
    }
    this.filterArray = this.userData;
    if (this.startIndex != 0 && this.endIndex != 0) {
      this.filterArray = this.userData.slice(this.startIndex, this.endIndex);
      return
    } else {
      this.filterArray = this.userData.slice(0, this.pageSize);
      return
    }
  }

  onToggleUser = (id) => {
    if(this.mapUser[id].status == 0){
      this.mapUser[id].status = 1;
      this.http.patch('http://shaktipharma.co.in/pharmaApi/public/api/user/' + id,{status : 1}).subscribe(data=>{
      });
    }else if(this.mapUser[id].status == 1){
      this.mapUser[id].status = 0;
      this.http.patch('http://shaktipharma.co.in/pharmaApi/public/api/user/' + id,{status : 0}).subscribe(data=>{
      });
    }
  }

}
