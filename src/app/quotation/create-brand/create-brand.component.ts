import { DialogComponent } from './../../shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, UrlTree } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BrandManagementService } from 'src/app/services/brand-management.service';
import { FormControl, FormGroup } from '@angular/forms';
import { brandMaster } from 'src/app/interfaces/interfaces.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'shakti-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss'],
})
export class CreateBrandComponent implements OnInit {
  constructor(
    private brandMasterService: BrandManagementService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialogComponent: DialogComponent
  ) {}

  brandDetails = [];
  valueChanged: boolean = false;
  brandForm = new FormGroup({
    label: new FormControl(null),
    status: new FormControl(0),
  });
  id;
  isEdit: boolean = false;

  ngOnInit(): void {
    this.getParams();

    this.brandMasterService.getBrandDetailsById(this.id).subscribe(response => {
      console.log(response.data);
      this.brandForm.patchValue({
        label: response?.data.label,
        status: +response.data.status
      })
    })
    this.brandForm.valueChanges.subscribe((response) => {
      this.valueChanged = true;
      console.log("Martini Martini Baby");
    });
  }

  getParams = () => {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.validateParams();
    });
  };

  validateParams = () => {
    if (this.id == 'new') {
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.brandMasterService
        .getBrandDetailsById(this.id)
        .subscribe((response) => {
          console.log(response.data.label);
          this.brandForm.patchValue({
            label: response.data.label,
            status: +response.data.status,
          });
          this.valueChanged = false;
        });
    }
  };

  onAdd = () => {
    let brandMaster: brandMaster = this.brandForm.value;
    brandMaster.status = +brandMaster.status;
    if (!this.isEdit) {
      this.brandMasterService.createBrandMaster(brandMaster).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.brandMasterService
        .updateBrandDetails(this.id, brandMaster)
        .subscribe((response) => {
          console.log(response);
          if (response) {
            this.valueChanged = false;
          }
        });
    }
  };

  canDeactivate() {
    if (this.valueChanged) {
      const result = window.confirm('There are Unsaved Changes! Are You Sure?');
      return of(result);
    }
    return true;
  }
}
