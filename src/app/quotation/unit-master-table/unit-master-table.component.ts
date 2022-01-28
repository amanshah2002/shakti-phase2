import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UnitMasterService } from 'src/app/services/unit-master.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'shakti-unit-master-table',
  templateUrl: './unit-master-table.component.html',
  styleUrls: ['./unit-master-table.component.scss']
})
export class UnitMasterTableComponent implements OnInit {
  id
  p: number = 1
  totalLength: number
  unitDetails = []
  showDelay = new FormControl(500)
  unitDetailsColumns = ['unitShortName', 'unitName', 'status', 'actions']
  unitSortKey = ['short_label', 'label','status']
  unitSortObject = {};
  filterData = []
  searchKeys = ['short_label','label','status'];
  isDataReceived:boolean = false;
  constructor(
    private router: Router,
    private unitMasterService: UnitMasterService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.unitMasterService.getUnitMasterList().subscribe(response => {
      console.log(response.data.data);
      this.isDataReceived = true;
      // this.unitDetails = response.data.data
      this.filterData = this.unitDetails;
      this.totalLength = this.filterData?.length
    })
    this.initializeSortKeys();
  }

  onAdd = () => {
    this.router.navigate(['phase2/unit-master-table/new']);
  }

  onEditUnit = (id) => {
    this.router.navigate(['phase2/unit-master-table/' + id]);
  }

  onDeleteUnit = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this unit. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
      autoFocus: false,
    });
    dialogref.afterClosed().subscribe(data => {
      if (data) {
        console.log(id);
      }
    })
  }

  onSearch = (searchString) => {
    this.filterData = [];
    if(searchString == ''){
      console.log(searchString);
      this.filterData = this.unitDetails
      return
    }
    this.searchKeys.map(keys => {
      this.unitDetails.map((data:any) => {
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
    this.unitSortKey.map(keys => {
      this.unitSortObject[keys] = {
        sortState: false
      }
    })
    console.log(this.unitSortObject);
  }

  onSort = (sortString: string) => {
    this.unitSortObject[sortString].sortState = !this.unitSortObject[sortString].sortState;
    console.log(this.unitSortObject);
    this.unitSortObject[sortString].sortState ? this.unitDetails.sort((a, b) => a[sortString] > b[sortString] ? 1 : -1) :
      this.unitDetails.sort((a, b) => a[sortString] < b[sortString] ? 1 : -1);

  }

}
