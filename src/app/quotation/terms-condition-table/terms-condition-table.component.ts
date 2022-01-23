import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TermsConditionsService } from 'src/app/services/terms-conditions.service';

@Component({
  selector: 'shakti-terms-condition-table',
  templateUrl: './terms-condition-table.component.html',
  styleUrls: ['./terms-condition-table.component.scss']
})
export class TermsConditionTableComponent implements OnInit {
  id
  p: number = 1
  totalLength: number
  valueChanged: boolean = false
  termsConditionDetails = []
  showDelay = new FormControl(500)
  termsConditionColumns = ['srNo', 'title', 'status', 'actions']
  constructor(private router: Router, private termsConditionService: TermsConditionsService) { }

  ngOnInit(): void {
    this.termsConditionService.getTermsCondition().subscribe(response => {
      console.log(response.data);
      this.termsConditionDetails = response.data.data
      this.totalLength = this.termsConditionDetails.length
    })
  }

  onAdd = () => {
    this.router.navigate(['phase2/terms-condition-table/new']);
  }

  onEditUnit = (id) => {
    this.router.navigate(['phase2/terms-condition-table/' + id]);
  }

  onDeleteUnit = (id) => {
    this.termsConditionDetails.splice(id, 1)
    console.log(id);
  }

  canDeactivate() {
    if (this.valueChanged) {
      const result = window.confirm('There are Unsaved Changes! Are You Sure?');
      return of(result);
    }
    return true;
  }

}
