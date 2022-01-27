import { CompanyVisitService } from './../../services/company-visit.service';
import { DialogComponent } from './../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';
import { UserDataService } from '../../services/user-data.service';
import { CanComponentDeactivate } from '../can-deactivate.guard';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'shakti-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, CanComponentDeactivate {
  constructor(
    private userData: UserDataService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private companyVisitService: CompanyVisitService
  ) { }
  canDeactivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.valueChanged) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          header: 'Unsaved Data',
          content:
            'There are unsaved changes on this page, are you sure you want to leave?',
          yesBtn: 'Yes',
          noBtn: 'No',
        },
        autoFocus: false,
      });
      return dialogRef.afterClosed();
    }
    return true;
  }
  userForm = new FormGroup(
    {
      Name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(70),
        Validators.pattern('[a-zA-Z][a-zA-Z ]+'),
      ]),
      Role: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      Country: new FormControl(null, Validators.required),
      Phone_Number: new FormControl(null, [
        Validators.maxLength(13),
        Validators.minLength(10),
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
        ),
      ]),
      confirmPassword: new FormControl(null, Validators.required),
      userType: new FormControl(null, Validators.required),
      permission: new FormControl(null)
    },
    this.passCheck.bind(this)
  );

  id;
  countryName = [];
  filteredCountry = [];
  permissions = this.userData.pemrissionsArray;
  userTypeDropDown = this.userData.userTypeArray;
  userCountryDropDown;
  userRoleDropDown = this.userData.userRoleArray;
  phonecode = {};
  result;
  passwordType: 'password' | 'text' = 'password';
  ConfirmPasswordType: 'password' | 'text' = 'password';
  valueChanged: boolean = false;
  passwordvisible: boolean = false;
  ConfirmPasswordvisible: boolean = false;
  editMode: boolean = false;
  loading: boolean = false;
  hidePhonePrefix: boolean = true;
  isVal: boolean = false;
  @ViewChild('phone') phone: ElementRef;
  ngOnInit(): void {
    this.locationService.countryObs.subscribe((data) => {
      if (data) {
        this.userCountryDropDown = data;
        this.filteredCountry = data;
        this.onPhoneCode(data);
        this.countryName = this.userCountryDropDown.slice();
      }
    });
    this.activeRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id != 'new') {
        this.editMode = true;
        this.editForm();
      } else if (this.id == 'new') {
        this.editMode = false;
        this.userForm.valueChanges.subscribe((val) => {
          this.valueChanged = true;
        });
      } else if (!this.id) {
        this.router.navigate(['/user']);
      }
    });
    this.userForm.controls.Phone_Number.valueChanges.subscribe((val) => {
      if (val != null) {
        this.isVal = true;
      } else {
        this.isVal = false;
      }
    });
  }

  createPermissionObject = () => {
    let permissionObject = []
    if (this.userForm.value.permission) {
      this.userForm.value.permission?.map((permissionId) => {
        permissionObject.push({ id: permissionId });
      })
    }
    return permissionObject;
  }

  onSave = () => {
    const form = this.userForm;
    this.valueChanged = false;
    const titleCase = new TitleCasePipe();
    form.value["Name"] = titleCase.transform(form.value.Name);
    const permissionObject = this.createPermissionObject();
    console.log(permissionObject);
    form.value['permission'] = permissionObject;
    console.log(form.value);
    if (this.editMode) {
      this.userData.onUpdateUser(this.id, form.value).subscribe(
        (data) => {
          this.router.navigate(['/users']);
        },
        (error) => {
          let errorMsg = 'An unknown error occurred.';
          if (!error.error.errors) {
            this.snackbar.open(errorMsg, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'center',
              duration: 5000,
            });
            return;
          } else if (error.error.errors) {
            if (
              error.error.message ==
              'There are some errors on your request parameters'
            ) {
              const err = error.error.errors[0];
              if (err.name) {
                errorMsg = err.name;
              } else if (err.email) {
                errorMsg = err.email;
              } else if (err.user_role) {
                errorMsg = err.user_role;
              }
            } else {
              errorMsg = error.error.message;
            }
            this.snackbar.open(errorMsg, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'center',
              duration: 5000,
            });
          }
        }
      );
    } else {
      this.userData.addUserData(form.value).subscribe(
        (data) => {
          this.router.navigate(['users']);
        },
        (error) => {
          this.valueChanged = true;
          let errorMsg = 'An unknown error occurred.';
          if (!error.error.errors) {
            this.snackbar.open(errorMsg, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'center',
              duration: 5000,
            });
            return;
          } else if (error.error.errors) {
            console;
            if (
              error.error.message ==
              'There are some errors on your request parameters'
            ) {
              const err = error.error.errors[0];
              if (err.name) {
                errorMsg = err.name;
              } else if (err.email) {
                errorMsg = err.email;
              } else if (err.password) {
                errorMsg = err.password;
              } else if (err.confirm_password) {
                errorMsg = err.confirm_password;
              } else if (err.user_type) {
                errorMsg = err.user_type;
              } else if (err.user_country) {
                errorMsg = err.user_country;
              } else if (err.role) {
                errorMsg = err.role;
              }
            } else {
              errorMsg = error.error.message;
            }
            this.snackbar.open(errorMsg, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'center',
              duration: 5000,
            });
          }
        }
      );
    }
  };
  patchPermission = (userData) => {
    let array = [];
    userData?.permission.map(p => {
      array.push(+p.permission);
    })
    return array;
  }

  private editForm = () => {
    this.userData.findUserById(+this.id).subscribe(
      (data) => {
        if (data) {
          console.log(data);
          const userData = data.data;
          this.userForm.controls.Name.setValue(userData?.name);
          this.userForm.controls.email.setValue(userData?.email);
          console.log("UserDetailComponent ~ this.userForm.controls.Email", this.userForm.controls.email.value);
          this.userForm.controls.userType.setValue(userData?.user_type.id);
          this.userForm.controls.Country.setValue(userData?.user_country.id);
          this.userForm.controls.Phone_Number.setValue(userData?.phone);
          const patchPermission = this.patchPermission(userData);
          console.log("UserDetailComponent ~ array", patchPermission);
          this.userForm.controls.permission.setValue(patchPermission);
          this.userForm.valueChanges.subscribe((val) => {
            this.valueChanged = true;
          });
        }
      },
      (error) => {
        let errorMsg = 'An unknown error occurred, please try again';
        if (!error.error.message) {
          this.userForm.reset();
          this.snackbar.open(errorMsg, 'Dismiss', {
            duration: 3000,
            verticalPosition: 'top',
          });
          return;
        } else {
          errorMsg = error.error.message;
          this.userForm.reset();
          this.valueChanged = false;
          this.companyVisitService.snackbarOpen(errorMsg);
        }
      }
    );
  };

  passCheck(form: FormGroup) {
    if (form.value.password != form.value.confirmPassword) {
      form.controls.confirmPassword.setErrors({ passCheck: true });
    } else {
      return null;
    }
  }

  onPhoneCode = (countryList) => {
    countryList.map((country) => {
      this.phonecode[country.id] = {
        phoneCode: '+' + country.phonecode,
      };
    });
  };

  onFocus = () => {
    this.hidePhonePrefix = false;
  };

  onFocusOut = () => {
    this.hidePhonePrefix = true;
  };

  onPasswordVisiblityToggle = () => {
    this.passwordvisible = !this.passwordvisible;
    if (this.passwordvisible) {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  };

  onConfirmPasswordVisiblityToggle = () => {
    this.ConfirmPasswordvisible = !this.ConfirmPasswordvisible;
    if (this.ConfirmPasswordvisible) {
      this.ConfirmPasswordType = 'text';
    } else {
      this.ConfirmPasswordType = 'password';
    }
  };

  onFilterCountry = (countryName) => {
    this.filteredCountry = this.userCountryDropDown.filter((country) =>
      country.name.toLowerCase().includes(countryName.toLowerCase())
    );
  };

  displayName = (country) => {
    return country ? this.userCountryDropDown[country - 1].name : '';
  };
}
