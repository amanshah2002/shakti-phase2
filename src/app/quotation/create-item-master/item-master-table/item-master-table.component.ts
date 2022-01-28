
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemManagementService } from 'src/app/services/item-management.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'shakti-item-master-table',
  templateUrl: './item-master-table.component.html',
  styleUrls: ['./item-master-table.component.scss']
})
export class ItemMasterTableComponent implements OnInit {

  id;
  p: number = 1
  totalLength: number
  showDelay = new FormControl(1000);
  itemData: [];
  displayedColumns = ['srNo', 'itemCode', 'itemName', 'unit', 'status', 'actions'];
  itemSortKey = ['item_name', 'item_unit','item_code','item_status'];
  itemSortObject = {};
  filterData = []
  searchKeys = ['id','item_code','item_name','item_unit'];
  isDataRecieved:boolean = false;


  constructor(private router: Router,
    private itemMasterService: ItemManagementService) { }

  ngOnInit(): void {
    this.itemMasterService.getItemMaster().subscribe(response => {
      console.log(response.data.data);
      this.isDataRecieved = true;
      this.itemData = response.data.data
      this.filterData = this.itemData;
      this.totalLength = this.filterData?.length
    })
    this.initializeSortKeys();
  }

  onAddItem = () => {
    this.router.navigate(['phase2/item-table/new']);
  }

  onEditItem = (id) => {
    this.router.navigate(['phase2/item-table/' + id]);
  }

  onDeleteItem = (id) => {
    console.log(id);
  }

  onAdd = () => {
    this.router.navigate(['phase2/item-table/new']);
  }

  onSearch = (searchString) => {
    this.filterData = [];
    if(searchString == ''){
      console.log(searchString);
      this.filterData = this.itemData
      return
    }

    this.searchKeys.map(keys => {
      // this.filterData = this.itemData.filter((a: any) => a[keys].toString().toLowerCase().includes(searchString.toLowerCase()))
      this.itemData.map((data:any) => {
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
    this.itemSortKey.map(keys => {
      this.itemSortObject[keys] = {
        sortState: false
      }
    })
  }


  onSort = (sortString: string) => {
    this.itemSortObject[sortString].sortState = !this.itemSortObject[sortString].sortState;
    this.itemSortObject[sortString].sortState ? this.itemData.sort((a, b) => a[sortString] > b[sortString] ? 1 : -1) :
      this.itemData.sort((a, b) => a[sortString] < b[sortString] ? 1 : -1);

  }

}
