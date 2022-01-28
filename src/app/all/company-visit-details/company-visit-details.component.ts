import { map } from 'rxjs/operators';
import { GstDialogComponent } from './../../shared/dialog/gst-dialog/gst-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserType } from './../../shared/enums/user_type.enum';
import { DialogComponent } from './../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Params, ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyVisitService } from 'src/app/services/company-visit.service';
import { LocationService } from 'src/app/services/location.service';
import { Observable } from 'rxjs';
import { CanCompanyComponentDeactivate } from '../company-visit-details/company-can-deactivate.guard';
import { UserDataService } from 'src/app/services/user-data.service';
import { gstDetails } from 'src/app/interfaces/interfaces.component';
@Component({
  selector: 'shakti-company-visit-details',
  templateUrl: './company-visit-details.component.html',
  styleUrls: ['./company-visit-details.component.scss'],
})
export class CompanyVisitDetailsComponent
  implements OnInit, CanCompanyComponentDeactivate {
  companyTypeDropDown = this.userDataService.companyTypeArray;
  companyForm = new FormGroup({
    company_type: new FormControl(null, Validators.required),
    company_name: new FormControl(null, Validators.required),
    remarks: new FormControl(null),
    reference: new FormControl(null),
    company_website: new FormControl(null),
    address: new FormArray([]),
    phone: new FormArray([]),
  });
  //arrays
  countryDropDown = [];
  countryFilterDropDown = [];
  stateListDropDown = [];
  stateList = [];
  contactCountryFilterList = [];
  companyEditForm;
  deleteAddress = [];
  deletePhone = [];
  deleteContactNumber = [];
  deleteContactEmail = [];
  delete_gst = [];
  contactTypeList = this.companyVisitService.contactType;
  //variables
  phoneCode;
  id;
  companyTypeData;
  user;
  companyType;
  gstDetails: gstDetails;
  //boolean
  valueChanged: boolean = false;
  prefix: boolean[] = [];
  editMode: boolean;
  isCompanyTypeDisabled: boolean = false;
  isCountryDisabled: boolean = false;
  //observable
  stateListObservable = {};
  statesObject: any = {};

  constructor(
    private userDataService: UserDataService,
    private locationService: LocationService,
    private companyVisitService: CompanyVisitService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
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

  ngOnInit(): void {
    this.getUser();
    this.getCountryList(); //calling country api
    this.readCompanyType();
  }

  resetAddress = () => {
    for (let i = 0; i < this.companyForm.controls.address.value.length; i++) {
      (<FormArray>this.companyForm.get('address')).removeAt(i);
    }
  };

  resetContact = () => {
    for (let i = 0; i < this.companyForm.controls.phone.value.length; i++) {
      (<FormArray>this.companyForm.get('phone')).removeAt(i);
    }
  };

  onNewAddress = (length?) => {
    this.checkCompanyType();
    if (this.companyForm.get('address').invalid) {
      return;
    } else if (length) {
      this.isCountryDisabled = false;
      this.isCompanyTypeDisabled = false;
      const editAddress = this.companyEditForm.address;
      this.countryFilterDropDown = [];
      for (let i = 0; i < length; i++) {
        (<FormArray>this.companyForm.get('address')).push(
          new FormGroup({
            id: new FormControl(editAddress[i].id),
            address: new FormControl(
              editAddress[i]?.address
            ),
            country: new FormControl(
              editAddress[i]?.country?.id
            ),
            state: new FormControl(
              editAddress[i]?.state?.id
            ),
            city: new FormControl(editAddress[i]?.city,),
            zip: new FormControl(editAddress[i]?.zip, [
              Validators.pattern("^[a-zA-Z -'0-9]+"),
            ]),
          })
        );
        this.countryFilterDropDown[i] = this.countryDropDown;
        this.prefix[i] = false;
      }
      return;
    }

    if (!length) {
      (<FormArray>this.companyForm.get('address')).push(
        new FormGroup({
          id: new FormControl(0),
          address: new FormControl(null),
          country: new FormControl(
            this.id == 'domestic' || this.companyType == 6 ? +this.user?.user_country : null
          ),
          state: new FormControl(null,),
          city: new FormControl(null,),
          zip: new FormControl(null, [
            Validators.pattern("^[a-zA-Z -'0-9]+"),
          ]),
        })
      );
    }
    this.countryFilterDropDown.push(this.countryDropDown);
    this.prefix.push(false);
  }; //add new address

  onNewPhoneDetails = (length?) => {
    this.checkCompanyType();
    if (this.companyForm.get('phone').invalid) {
      return;
    } else if (length) {
      this.isCountryDisabled = false;
      this.isCompanyTypeDisabled = false;
      const editPhone = this.companyEditForm.phone;
      for (let i = 0; i < length; i++) {
        (<FormArray>this.companyForm.get('phone')).push(
          new FormGroup({
            contact_name: new FormControl(
              editPhone[i]?.contact_name
            ),
            contact_number: new FormArray([]),
            contact_type: new FormControl(
              editPhone[i]?.phonetype.id
            ),
            contact_designation: new FormControl(
              editPhone[i]?.contact_designation
            ),
            contact_email: new FormArray([]),
            country: new FormControl(
              +editPhone[i]?.country
            ),
            id: new FormControl(editPhone[i].id),
          })
        );
        if (editPhone[i]?.contact_email?.length > 0) {
          editPhone[i]?.contact_email?.map(phone => {
            this.onNewEmail(i, phone)
          });
        } else {
          this.onNewEmail(i);
        }

        if (editPhone[i]?.contact_number?.length > 0) {
          editPhone[i]?.contact_number?.map(phone => {
            this.onNewContactNo(i, phone)
          });
        } else {
          this.onNewContactNo(i);
        }

        this.contactCountryFilterList[i] = this.countryDropDown;
      }
      return;
    }

    if (!length) {
      (<FormArray>this.companyForm.get('phone')).push(
        new FormGroup({
          contact_name: new FormControl(null),
          contact_number: new FormArray([]),
          contact_type: new FormControl(null),
          contact_designation: new FormControl(null),
          contact_email: new FormArray([]),
          country: new FormControl(
            this.id == 'domestic' || this.companyType == 6 ? +this.user.user_country : null
          ),
          id: new FormControl(0),
        })
      );

      const length = this.companyForm.controls.phone['controls'].length;
      this.onNewEmail(length - 1);
      this.onNewContactNo(length - 1);
    }

    this.contactCountryFilterList.push(this.countryDropDown);
  };

  getEmail = (form) => {
    return form.controls.contact_email.controls;
  }

  getContactNo = (form) => {
    return form.controls.contact_number.controls;
  }

  onNewEmail = (index: number, editValue?: any) => {
    const control = <FormArray>this.companyForm.get('phone')['controls'][index].get('contact_email');
    control.push(
      new FormGroup({
        id: new FormControl(editValue?.id ? editValue.id : 0),
        contact_email: new FormControl(editValue?.contact_email ? editValue.contact_email : null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,63}$'))
      })
    );
  }

  onNewContactNo = (index: number, editValue?: any) => {
    const control = <FormArray>this.companyForm.get('phone')['controls'][index].get('contact_number');
    control.push(
      new FormGroup({
        id: new FormControl(editValue?.id ? editValue.id : 0),
        contact_no: new FormControl(editValue?.contact_no ? editValue.contact_no : null)
      })
    );
  }

  onRemoveContactNumber = (parentIndex: number, index: number) => {
    const control = <FormArray>this.companyForm.get('phone')['controls'][parentIndex].get('contact_number');
    const numberId = control.controls[index]['controls']['id'];
    control.removeAt(index);
    if (numberId != 0) {
      this.deleteContactNumber.push({
        id: numberId.value,
      });
    }
  }

  onRemoveContactEmail = (parentIndex: number, index: number) => {
    const control = <FormArray>this.companyForm.get('phone')['controls'][parentIndex].get('contact_email');
    const emailId = control.controls[index]['controls']['id'];
    control.removeAt(index);
    if (emailId != 0) {
      this.deleteContactEmail.push({
        id: emailId.value,
      });
    }
  }

  onAddGstDetails = () => {
    if (this.gstDetails) {
      const dialogref = this.dialog.open(GstDialogComponent, { data: { data: this.gstDetails, length: this.gstDetails.length } });
      dialogref.afterClosed().subscribe(data => {
        if (data) {
          this.gstDetails = data.data.gstInfo;
          this.delete_gst = data.data.deleteGst;
        }
      })
    } else {
      const dialogref = this.dialog.open(GstDialogComponent);
      dialogref.afterClosed().subscribe(data => {
        if (data) {
          this.gstDetails = data.data.gstInfo;
        }
      })
    }
  }

  checkCompanyType = () => {
    if (this.id != 'domestic' && this.id != 'international') {
      this.companyVisitService.fetchCompanyById(this.id).subscribe((data) => {
        if (data) {
          this.companyType = +data.data.company_type;
        }
      });
    }
  };

  getCountryList = () => {
    this.locationService.countryObs.subscribe((data) => {
      if (data) {
        this.countryDropDown = data;
        this.parseCountryList(data);
        this.params();
        //checking params
      }
    });
  }; //calling country list api

  onDeleteAddress = (index) => {
    const addressId = this.companyForm.controls.address.value[index]?.id;
    if (addressId != 0) {
      this.deleteAddress.push({
        id: addressId,
      });
      this.onDeleteAddressIndex(index);
      return;
    } else {
      this.onDeleteAddressIndex(index);
    }
  };

  onDeleteAddressIndex = (index) => {
    (<FormArray>this.companyForm.get('address')).removeAt(index);
    this.countryDropDown.splice(index, 1);
  };

  getUser = () => {
    this.authService.currentUser.subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
  };

  parseCountryList = (countryList) => {
    countryList.map((country) => {
      this.statesObject[country.id] = {
        states: country.states,
        phoneCode: country.phonecode,
      };
    });
  };

  onDeleteContact = (index) => {
    const phoneId = this.companyForm.controls.phone.value[index].id;
    if (phoneId != 0) {
      this.deletePhone.push({
        id: phoneId,
      });
      this.onDeleteContactIndex(index);
    } else {
      this.onDeleteContactIndex(index);
    }
  };

  onDeleteContactIndex = (index) => {
    (<FormArray>this.companyForm.get('phone')).removeAt(index);
    this.prefix.splice(index, 1);
  };

  showPrefix = (index) => {
    this.prefix[index] = true;
  }; //shows phone code

  hidePrefix = (index) => {
    this.prefix[index] = false;
  }; //hides phone code

  onSave = () => {
    this.valueChanged = false;
    const form = this.companyForm.value;

    if (this.editMode) {
      const editPayLoad = {
        ...form,
        gst: this.gstDetails,
        delete_address: this.deleteAddress,
        delete_phone: this.deletePhone,
        delete_numbers: this.deleteContactNumber,
        delete_emails: this.deleteContactEmail,
        delete_gst: this.delete_gst
      };
      this.companyVisitService.editCompany(editPayLoad, this.id).subscribe(
        (data) => {
          const companyType = this.companyForm.get('company_type').value;
          this.redirectByCompanyType(companyType);
        },
        (error) => {
          let errorMsg = 'An unknown error occurred, please try again';
          if (!error?.error?.errors) {
            this.companyVisitService.snackbarOpen(errorMsg);
            return;
          }
          errorMsg = 'Please enter valid details.';
          this.companyVisitService.snackbarOpen(errorMsg);
        }
      );
      return;
    }
    this.postCompanyForm();
  };

  onSelectionChange = (event) => {
    event.steps._results.forEach((element) => {
      element.interacted = false;
    });
  };

  postCompanyForm = () => {
    const form = {
      ...this.companyForm.value,
      gst: this.gstDetails,
      delete_address: [{
        id: 0
      }],
      delete_phone: [{
        id: 0
      }],
      delete_gst: [{
        id: 0
      }],
    };

    this.companyVisitService.saveCompany(form).subscribe(
      (data) => {
        const companyType = this.companyForm.get('company_type').value;
        this.redirectByCompanyType(companyType);
      },
      (error) => {
        let errorMsg = 'An unknown error occurred, please try again';
        if (!error.error.errors) {
          this.companyVisitService.snackbarOpen(errorMsg);
          return;
        }
        errorMsg = 'Please enter valid details.';
        this.companyVisitService.snackbarOpen(errorMsg);
      }
    );
  };

  params = () => {
    this.activeRoute.params.subscribe((params: Params) => {
      this.id = params['id']; //domestic
      if (this.id) {
        if (this.id != 'domestic' && this.id != 'international') {
          this.editMode = true;
          this.editCompanyForm(this.id);
        } else if (this.id == 'domestic' || this.id == 'international') {
          this.editMode = false;
          this.getUser();
          this.companyForm.reset();
          this.resetAddress();
          this.resetContact();
          if (this.id == 'domestic') {
            if (+this.user.user_type == 7) {
              this.valueChanged = false;
              this.router.navigate(['manage-company/international']);
              return;
            }
            this.onNewAddress();
            this.onNewPhoneDetails();
            this.isCountryDisabled = true;
            this.isCompanyTypeDisabled = true;
            this.companyForm.controls.company_type.setValue(6);
            this.isCompanyTypeDisabled = true;
          } else if (this.id == 'international') {
            if (+this.user.user_type == 6) {
              this.valueChanged = false;
              this.router.navigate(['manage-company/domestic']);
              return;
            }
            this.isCountryDisabled = false;
            this.isCompanyTypeDisabled = true;
            this.onNewAddress();
            this.onNewPhoneDetails();
            this.companyForm.controls.company_type.setValue(7);
          }

          this.valueChanged = false;
          this.companyForm.valueChanges.subscribe((data) => {
            this.valueChanged = true;
          });
        }
      }
    });
  };

  editCompanyForm = (id) => {
    let userType;
    this.authService.currentUser.subscribe((data) => {
      if (data) {
        userType = data.user_type;
      }
    });
    this.companyVisitService.fetchCompanyById(id).subscribe(
      (data) => {
        if (data?.data?.gst?.length != 0) {
          this.gstDetails = null;
          this.gstDetails = data.data.gst;
        }
        this.resetContact();
        this.resetAddress();
        if (data) {
          this.companyEditForm = data.data;
          if (
            +userType != 5 &&
            +userType != this.companyEditForm.company_type
          ) {
            this.companyVisitService.snackbarOpen(
              'You are not allowed to access this company'
            );
            this.valueChanged = false;
            this.router.navigate(['manage-company/all']);
            return;
          }
          this.companyForm.patchValue(this.companyEditForm);
          this.companyForm.controls.company_type.setValue(
            +this.companyEditForm.company_type
          );
          this.onNewAddress(this.companyEditForm.address.length);
          this.onNewPhoneDetails(this.companyEditForm.phone.length);
          this.valueChanged = false;
          this.companyForm.valueChanges.subscribe((data) => {
            this.valueChanged = true;
          });
        }
      },
      (error) => {
        let errorMsg = 'An unknown error occurred.';
        if (!error.error.message) {
          this.companyVisitService.snackbarOpen(errorMsg);
          this.router.navigate(['manage-company/all']);
          return;
        }
        errorMsg = error.error.message;
        this.companyVisitService.snackbarOpen(errorMsg);
        this.router.navigate(['manage-company/all']);
      }
    );
  };

  redirectByCompanyType = (companyType) => {
    if (companyType == '5') {
      this.router.navigate(['manage-company/all']);
      return;
    } else if (companyType == '6') {
      this.router.navigate(['manage-company/domestic']);
      return;
    } else {
      this.router.navigate(['manage-company/international']);
      return;
    }
  };

  readCompanyType = () => {
    let userType;
    this.authService.currentUser.subscribe((data) => {
      if (data) {
        userType = data.user_type;
      }
    });
    if (+userType != +UserType.All) {
      this.isCompanyTypeDisabled = true;
      this.valueChanged = false;
    }
  };
}
