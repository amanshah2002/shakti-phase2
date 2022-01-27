import { LocationService } from './../../services/location.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { CallAPIService } from './../call-api-service.service';
import { ChangePasswordDialogComponent } from './../../shared/dialog/change-password/change-password-dialog.component';

import { UserType } from './../../shared/enums/user_type.enum';
import { UserRoles } from './../../shared/enums/user-roles.enum';
import { BehaviorSubject, throwError } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { changePass, permission } from 'src/app/interfaces/interfaces.component';



@Component({
  selector: 'shakti-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  constructor(private authService: AuthService, private dialog: MatDialog, private confirmDialog: DialogComponent,
    public router: Router,
    private callApiService: CallAPIService,
    private snackbar: MatSnackBar,
    private locationService: LocationService,
    private activatedRoute: ActivatedRoute) { }
  UerType = UserType;
  quotationPermission: boolean = false;
  marketingPermission: boolean = false;
  isAuth: boolean;
  isDomestic: boolean = false;
  isInternational: boolean = false;
  isAll: boolean = false;
  isLogout: boolean;
  isCompanyActive: boolean = false;
  openMenu: boolean = false;
  isAdmin: boolean;
  userName: string;
  userType: string;
  date;
  hideDrawer: boolean = true;
  isAdminSubject = new BehaviorSubject<any>(null);
  isAdminSubjectObs = this.isAdminSubject.asObservable();
  changePassDetails: changePass;
  hideAdminPanel: boolean = false;

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isAuth = !!user;
      if (this.isAuth) {
        this.locationService.getCountryArray();
        this.userType = user.user_type;
        this.userName = user.name;
        this.userType == UserType.All ? this.isAll = true : this.isAll = false;
        this.userType == UserType.Domestic ? this.isDomestic = true : this.isDomestic = false;
        this.userType == UserType.International ? this.isInternational = true : this.isInternational = false;
        user.role == UserRoles.Admin ? this.isAdmin = true : this.isAdmin = false;
        const permissions = user?.permission;
        this.checkPermissions(permissions)
      }
    });
    setInterval(() => {
      this.date = new Date();
    }, 1000);

  }

  checkPermissions = (permissions) => {
    if(permissions){
    permissions?.map((permission: permission) => {
      if (+permission.permission == 1) {
        this.marketingPermission = true
      }
      else if (+permission.permission == 2) {
        this.quotationPermission = true;
      }
    });
  }
    console.log('marketing', this.marketingPermission);
    console.log('quotation', this.quotationPermission);
    this.authService.permissionCheck(this.quotationPermission, this.marketingPermission);
  }
  onLogout = () => {
    const dialogRef = this.dialog.open(DialogComponent, { data: { header: 'Logout', content: 'Are you sure you want to logout?', yesBtn: 'Yes', noBtn: 'No' }, autoFocus: false });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.authService.logout();
      }
    })
  }

  redirectById = (id) => {
    this.router.navigate(['company-visit-details/' + id]).then(() => {
      location.reload();
    });
  }

  onCompanyClick = () => {
    this.isCompanyActive = true;
  }
  isActive = () => {
    return this.router.url.includes('manage-company');
  }

  isNewCompanyActive = () => {
    return this.router.url.includes('company-visit-details');
  }

  isDomesticActive = () => {
    return this.router.url.includes('company-visit-details/domestic');
  }

  isInternationalActive = () => {
    return this.router.url.includes('company-visit-details/international');
  }

  toggleSidenav = () => {
    this.hideDrawer = !this.hideDrawer;
  }

  callChangePasswordApi = (form: changePass) => {
    return this.callApiService.callPostAPI('changePassword', form).pipe(catchError(error => {
      let errorMsg = 'An unknown error occurred.';
      if (!error.error.message) {
        return throwError(errorMsg);
      } else {
        errorMsg = error.error.message
        return throwError(errorMsg);
      }
    }));
  }

  onChangePassword = () => {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.changePassDetails = data.data.changePasswordForm;
        const changePassword = {
          current_password: this.changePassDetails.current_password,
          password: this.changePassDetails.password,
          confirm_password: this.changePassDetails.confirm_password
        }

        this.callChangePasswordApi(changePassword).subscribe(errorMsg => {
          this.snackbar.open(errorMsg, 'Dismiss', { verticalPosition: 'top', duration: 4000 })
        });
      }
    })
  }

  onSwitchPhase = () => {
    if (this.router.url.includes('phase2')) {
      this.router.navigate(['users']);
      return
    }
    this.router.navigate(['phase2/quotation-table/domestic']);
  }

  toggleAdminPanel = () => {
    this.hideAdminPanel = !this.hideAdminPanel;
    console.log(this.hideAdminPanel);
  }

  onBrandMaster = () => {
    this.router.navigate(['phase2/brand-table'])
  }

  onCompanyMaster = () => {
    this.router.navigate(['phase2/company-master-table'])
  }

  onItemMaster = () => {
    this.router.navigate(['phase2/item-table'])
  }

  onTandCMaster = () => {
    this.router.navigate(['phase2/terms-condition-table'])
  }

  onUnitMaster = () => {
    this.router.navigate(['phase2/unit-master-table'])
  }

  onDomesticQuotation = () => {
    this.router.navigate(['phase2/quotation-table/domestic']);
  }

  onInternationalQuotation = () => {
    this.router.navigate(['phase2/quotation-table/international']);
  }

}

