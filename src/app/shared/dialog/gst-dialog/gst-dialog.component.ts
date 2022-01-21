import { DialogComponent } from './../dialog.component';
import { CompanyVisitService } from './../../../services/company-visit.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { gstDetails } from 'src/app/interfaces/interfaces.component';

@Component({
  selector: 'shakti-gst-dialog',
  templateUrl: './gst-dialog.component.html',
  styleUrls: ['./gst-dialog.component.scss'],
})
export class GstDialogComponent implements OnInit {

  constructor(
    private companyVisitService: CompanyVisitService,
    @Inject(MAT_DIALOG_DATA) public data: { data: gstDetails; length: number },
    private dialogRef: MatDialogRef<GstDialogComponent>,
    private dialog: MatDialog
  ) {
    dialogRef.disableClose = true;
  }

  gstForm = new FormGroup({
    gstDetails: new FormArray([]),
  });
  delete_gst = [];
  valueChanges: boolean = false;
  gstCheckSum = '1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
  gstCheckSumArray = [];
  isCheckSum:boolean = true;
  total = 0;
  gstNumber:string;

  ngOnInit(): void {
    this.gstCheckSumArray = this.gstCheckSum.split(',');
    this.preFillDetails();
    this.gstForm.valueChanges.subscribe(data => {
      if (data) {
        this.valueChanges = true;
      }
    })
  }

  checkSumDigit = () => {
    const gst = this.gstForm.controls.gstDetails.value;
    for (let index = 0; index < gst.length; index++) {
      let total = 0;
      this.total = 0;
      let gstNumber: string = gst[index].gst_number;
      for (let i = 0; i < gstNumber.length-1; i++) {
        if (i % 2 == 0) {
           total = this.calcTotal(gstNumber,i,1);
        }else if(i % 2 != 0){
          total = this.calcTotal(gstNumber,i,2);
        }
      }
      if(gstNumber[gstNumber.length - 1].toUpperCase() == this.gstCheckSumArray[(36 - (total % 36)) - 1]){
        this.isCheckSum = true;
      }else{
        this.gstNumber = gstNumber;
        this.isCheckSum = false;
        return
      }
    }
  }

  calcTotal = (gstNumber,i,m) => {
    if (+gstNumber[i] >= 0 && +gstNumber[i] <= 9) {
      this.total += +((+gstNumber[i] * m) % 36) + Math.floor(+((+gstNumber[i] * m) / 36));
    } else if (gstNumber[i].toUpperCase() >= 'A' && gstNumber[i].toUpperCase() <= 'Z') {
      this.total += +(((this.gstCheckSumArray.indexOf(gstNumber[i].toUpperCase()) + 1) * m) % 36) +
      Math.floor(+(((this.gstCheckSumArray.indexOf(gstNumber[i].toUpperCase()) + 1) * m) / 36));
    }

    return this.total;
  }

  onAddGstForm = (data: gstDetails) => {
    if (this.gstForm.get('gstDetails').invalid) {
      this.gstForm.get('gstDetails').markAllAsTouched;
      this.companyVisitService.snackbarOpen(
        'Please enter valid details in the current form.'
      );
      return;
    }
    (<FormArray>this.gstForm.get('gstDetails')).push(
      new FormGroup({
        gst_number: new FormControl(data?.gst_number, [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(15),
          Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$'),
        ]),
        gst_name: new FormControl(data?.gst_name, [
          Validators.required,
          Validators.pattern('[a-zA-Z][a-zA-Z ]+'),
        ]),
        gst_address: new FormControl(data?.gst_address),
        gst_pin: new FormControl(data?.gst_pin),
        id: new FormControl(data?.id),
      })
    );
  };

  onAddGstDetails = () => {
    this.checkSumDigit();
    this.total = 0;
    if(this.isCheckSum){
      this.valueChanges = false;
      this.dialogRef.close({
        data: {
          gstInfo: this.gstForm.get('gstDetails').value,
          deleteGst: this.delete_gst,
        },
      });
    }else{
      let message = 'Gst number ' + '[' +  this.gstNumber + ']' + ' is incorrect.';
      this.companyVisitService.snackbarOpen(message);
      return
    }
  };

  onCancel = () => {
    if (this.valueChanges) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          header: 'Are you sure',
          content: 'There are unsaved changes on this form, are you sure you want to leave?',
          yesBtn: 'Yes',
          noBtn: 'No',
        },
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.dialogRef.close();
        } else {
          return
        }
      })
    } else {
      this.dialogRef.close();
    }
  };

  removeGstDetail = (index) => {
    const id = this.gstForm.controls.gstDetails.value[index].id;
    if (id != null) {
      this.delete_gst.push({
        id: id,
      });
    }
    (<FormArray>this.gstForm.get('gstDetails')).removeAt(index);
  };

  preFillDetails = () => {
    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        this.onAddGstForm(this.data.data[i]);
      }
    } else {
      this.onAddGstForm(null);
    }
  }

  // checkSum() {
  //   // if (!this.isCheckSum) {
  //   //   form.get('gst_number').setErrors({ checkSum: true });
  //   // } else {
  //   //   return null;
  //   // }
  //   const gst = this.gstForm.controls.gstDetails.value;
  //   for (let index = 0; index < gst.length; index++) {
  //     let total = 0;
  //     let gstNumber: string = gst[index].gst_number;
  //     for (let i = 0; i < gstNumber?.length-1; i++) {
  //       if (i % 2 == 0) {
  //         if (+gstNumber[i] >= 0 && +gstNumber[i] <= 9) {
  //           total += +(+gstNumber[i] % 36) + Math.floor(+(+gstNumber[i] / 36));
  //         } else if (gstNumber[i].toUpperCase() >= 'A' && gstNumber[i].toUpperCase() <= 'Z') {
  //           total += +((this.gstCheckSumArray.indexOf(gstNumber[i].toUpperCase()) + 1) % 36) +
  //           Math.floor(+((this.gstCheckSumArray.indexOf(gstNumber[i].toUpperCase()) + 1) / 36));
  //         }
  //       }else if(i % 2 != 0){
  //         if (+gstNumber[i] >= 0 && +gstNumber[i] <= 9) {
  //           total += +((+gstNumber[i] * 2) % 36) + Math.floor(+((+gstNumber[i] * 2) / 36));
  //         } else if (gstNumber[i].toUpperCase() >= 'A' && gstNumber[i].toUpperCase() <= 'Z') {
  //           total += +(((this.gstCheckSumArray.indexOf(gstNumber[i].toUpperCase()) + 1)*2) % 36) +
  //           Math.floor(+(((this.gstCheckSumArray.indexOf(gstNumber[i].toUpperCase()) + 1)*2) / 36));
  //         }
  //       }
  //     }
  //     if(gstNumber[gstNumber?.length - 1]?.toUpperCase() == this.gstCheckSumArray[(36 - (total % 36)) - 1]){
  //       return null
  //     }else{
  //       gst.gstDetails.get('gst_number').setErrors({ checkSum: true });
  //     }

  //
  //   }

  // }
}
