import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemManagementService } from 'src/app/services/item-management.service';

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

  constructor(private router: Router,
    private itemMasterService: ItemManagementService) { }

  ngOnInit(): void {
    this.itemMasterService.getItemMaster().subscribe(response => {
      console.log(response.data.data);
      this.itemData = response.data.data
      this.totalLength = this.itemData.length
    })
  }

  onAddItem = () => {
    this.router.navigate(['item-table/new']);
  }

  onEditItem = (id) => {
    this.router.navigate(['item-table/' + id]);
  }

  onDeleteItem = (id) => {
    console.log(id);
  }

  onAdd = () => {
    this.router.navigate(['item-table/new']);
  }

}
