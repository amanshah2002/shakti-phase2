import { MatDialog } from '@angular/material/dialog';
import { BrandManagementService } from 'src/app/services/brand-management.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { brandMaster } from 'src/app/interfaces/interfaces.component';

@Component({
  selector: 'shakti-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss'],
})
export class BrandTableComponent implements OnInit {
  id;
  p: number = 1
  totalLength: number
  showDelay = new FormControl(500);
  brandData: [];
  displayedColumns = ['srNo', 'brandName', 'status', 'actions'];
  brandSortKey = ['label', 'status']
  searchKeys = ['id','label','status'];
  filterData = [];
  brandSortObject = {}
  isDataReceived:boolean = false;
  constructor(
    private brandManagementService: BrandManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.brandManagementService.getBrandMasterList().subscribe((res) => {
      this.isDataReceived = true;
      this.brandData = res.data.data;
      this.filterData = this.brandData;
      this.totalLength = this.filterData?.length
    });
    this.initializeSortKeys();
  }

  onAddBrand = () => {
    this.router.navigate(['phase2/brand-table/new']);
  }

  onEditBrand = (id) => {
    this.router.navigate(['phase2/brand-table/' + id]);
  }


  onDeleteBrand = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this company. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
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
      this.filterData = this.brandData
      return
    }

    this.searchKeys.map(keys => {
      // this.filterData = this.brandData.filter((a:any) => a[keys].toString().toLowerCase().includes(searchString.toLowerCase()))
      this.brandData.map((data:any) => {
        if(data[keys].toString().toLowerCase().includes(searchString.toLowerCase())){
          if(this.filterData.indexOf(data) === -1){
            this.filterData.push(data);
          }
        }
      })
    })

  }

  initializeSortKeys = () => {
    this.brandSortKey.map(keys => {
      this.brandSortObject[keys] = {
        sortState: false
      }
    })
    console.log(this.brandSortObject);
  }

  onSort = (sortString: string) => {
    this.brandSortObject[sortString].sortState = !this.brandSortObject[sortString].sortState;
    this.brandSortObject[sortString].sortState ? this.brandData.sort((a, b) => a[sortString] > b[sortString] ? 1 : -1) :
      this.brandData.sort((a, b) => a[sortString] < b[sortString] ? 1 : -1);
  }

}
