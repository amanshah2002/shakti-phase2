import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UnitMasterService } from 'src/app/services/unit-master.service';
import { runInThisContext } from 'vm';
import { of } from 'rxjs';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'shakti-create-unit-master',
  templateUrl: './create-unit-master.component.html',
  styleUrls: ['./create-unit-master.component.scss'],
})
export class CreateUnitMasterComponent implements OnInit {
  id
  valueChanged: boolean = false
  unitMasterForm = new FormGroup({
    short_label: new FormControl(),
    label: new FormControl(),
    status: new FormControl(0),
  });
  constructor(private unitMasterService: UnitMasterService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    console.log(this.id)

    this.unitMasterForm.valueChanges.subscribe((response) => {
      this.valueChanged = true;
      console.log("Martini Martini Baby");
    });

  this.unitMasterService.getUnitDetailsById(this.id).subscribe(response => {
        console.log(response.data);
        this.valueChanged = false
        this.unitMasterForm.patchValue({
          short_label: response?.data.short_label,
          label: response?.data.label,
          status: +response.data.status
        })
        this.valueChanged = false
      })
  }

  onAdd = () => {
    let unitMaster = this.unitMasterForm.value
    unitMaster['status'] = +unitMaster['status']
    console.log(unitMaster);
    this.unitMasterService.createUnitMaster(this.unitMasterForm.value).subscribe(response => {
      console.log(response)
      if (response) {
        this.router.navigate(['phase2/unit-master-table'])
      }
    })
  }

  onUpdateForm = () => {
    this.unitMasterService.updateUnitDetails(this.id, this.unitMasterForm.value).subscribe(response => {
      console.log(response)
    })
  }

  onClearForm = () => {
    this.unitMasterForm.reset()
  }

  canDeactivate() {
    if (this.valueChanged) {
      const result = window.confirm('There are Unsaved Changes! Are You Sure?');
      return of(result);
    }
    return true;
  }
}
