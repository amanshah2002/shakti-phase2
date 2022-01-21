import { StorageService } from '../services/storage.service';
import { CompanyVisitService } from 'src/app/services/company-visit.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shakti-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit {
  companyList = [];
  allCompanyList = [];
  companyType = [];
  step;
  openPanel:boolean = false;
  pageSize: any;
  startIndex: number;
  endIndex: number;
  filterArray: any[];
  pageSizeOptions: number[] = [3, 5, 10];

  constructor(
    private companyVisitService: CompanyVisitService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // this.companyVisitService.getCompanyList().subscribe((data) => {
    //   if(data){
    //     this.companyList = data.data.data;
    //   }
    // });
  }


}
