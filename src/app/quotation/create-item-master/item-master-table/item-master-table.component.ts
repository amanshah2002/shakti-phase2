import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemManagementService } from 'src/app/services/item-management.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

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

  constructor(
    private router: Router,
    private itemMasterService: ItemManagementService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.itemMasterService.getItemMaster().subscribe(response => {
      console.log(response.data.data);
      this.itemData = response.data.data
      this.totalLength = this.itemData.length
    })
  }

  onAddItem = () => {
    this.router.navigate(['phase2/item-table/new']);
  }

  onEditItem = (id) => {
    this.router.navigate(['phase2/item-table/' + id]);
  }

  onDeleteItem = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this company. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
      autoFocus: false,
    });
    dialogref.afterClosed().subscribe(data => {
      if(data){
        console.log(id);
      }
    })
  }

  onAdd = () => {
    this.router.navigate(['phase2/item-table/new']);
  }

}
