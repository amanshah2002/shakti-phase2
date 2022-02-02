import { TermsConditionTableComponent } from './../terms-condition-table.component';
import { TermsConditionsService } from './../../../services/terms-conditions.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'shakti-create-terms-condition',
  templateUrl: './create-terms-condition.component.html',
  styleUrls: ['./create-terms-condition.component.scss'],
})
export class CreateTermsConditionComponent implements OnInit {
  statusType = [
    { name: 'Active', value: 0 },
    { name: 'Deactive', value: 1 },
  ];
  id

  termsConditionForm = new FormGroup({
    title: new FormControl(),
    status: new FormControl(0),
  });

  termsParameterForm = new FormGroup({
    term_id: new FormControl(),
    groupNo: new FormControl(),
    parameterName: new FormControl(),
    parameterValue: new FormControl(),
  });

  constructor(private route: ActivatedRoute, private router: Router, private termsConditionsService: TermsConditionsService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.termsConditionsService.getTermsConditionById(this.id).subscribe(response => {
      console.log(response.data);
      this.termsConditionForm.patchValue({
        title: response.data.title,
        status: +response.data.status
      })
    },(error => {
      this.termsConditionsService.displaySnackBar(error);
    }))

    this.termsConditionsService.listTermsParameter(this.id).subscribe(response => {
      // console.log(response);

    },(error => {
      this.termsConditionsService.displaySnackBar(error);
    }))
  }

  onAdd = () => {
    this.termsConditionsService.createTermsCondition(this.termsConditionForm.value).subscribe(response => {
      console.log(response);
    },(error => {
      this.termsConditionsService.displaySnackBar(error);
    }))
    let form = JSON.stringify(this.termsParameterForm.value);
    this.termsConditionsService.createTermsParameter(form).subscribe(response => {
      console.log(response);
    },(error => {
      this.termsConditionsService.displaySnackBar(error);
    }))
  };

  onUpdateForm = () => {};

  onCancel = () => {
    this.router.navigate(['phase2/terms-condition-table'])
  }

  onClearForm = () => {
    this.termsConditionForm.reset()
  };
}
