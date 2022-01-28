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
  termsConditionColumns = ['srNo', 'title', 'status', 'actions'];
  termsSortKey = ['title','status'];
  termsSortObject = {};
  filterData = [];
  searchKeys = ['id','title','status'];
  isDataReceived:boolean = false
  constructor(private router: Router, private termsConditionService: TermsConditionsService) { }

  ngOnInit(): void {
    this.termsConditionService.getTermsCondition().subscribe(response => {
      console.log(response.data);
      this.isDataReceived = true;
      this.termsConditionDetails = response.data.data
      this.filterData = this.termsConditionDetails;
      this.totalLength = this.filterData?.length
    })
    this.initializeSortKeys();
  }

  onAddTerms = () => {
    this.router.navigate(['phase2/terms-condition-table/new']);
  }

  onEdiTerms = (id) => {
    this.router.navigate(['phase2/terms-condition-table/' + id]);
  }

  onDeleteTerms = (id) => {
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

  onSearch = (searchString) => {
    console.log('helo');

    this.filterData = [];
    if(searchString == ''){
      console.log(searchString);
      this.filterData = this.termsConditionDetails
      return
    }

    this.searchKeys.map(keys => {
      // this.filterData = this.termsConditionDetails.filter((a: any) => a[keys].toString().toLowerCase().includes(searchString.toLowerCase()))
      this.termsConditionDetails.map((data:any) => {
        if(data[keys].toString().toLowerCase().includes(searchString.toLowerCase())){
          if(this.filterData.indexOf(data) === -1){
            this.filterData.push(data);
          }
        }
      })
    });
    console.log(this.filterData);
  }

  initializeSortKeys = () => {
    this.termsSortKey.map(keys => {
      this.termsSortObject[keys] = {
        sortState: false
      }
    })
  }

  onSort = (sortString: string) => {
    this.termsSortObject[sortString].sortState = !this.termsSortObject[sortString].sortState;
    this.termsSortObject[sortString].sortState ? this.termsConditionDetails.sort((a, b) => a[sortString] > b[sortString] ? 1 : -1) :
      this.termsConditionDetails.sort((a, b) => a[sortString] < b[sortString] ? 1 : -1);

  }

}
