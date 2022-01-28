import { ItemManagementService } from './../../../services/item-management.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'shakti-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
})
export class ItemDialogComponent implements OnInit {
  id;
  totalLength: number;
  itemTable = ['itemCode', 'itemName'];
  itemDetails: [];
  showDelay = new FormControl(500)
  itemTableDetails
  p: number = 1;

  @Output() submitClicked = new EventEmitter<any>();
  constructor(
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { itemCode: string; itemName: string },
    private itemManagementService: ItemManagementService
  ) {}

  ngOnInit(): void {
    this.itemManagementService.getItemMaster().subscribe((response) => {
      console.log(response);
      this.itemTableDetails = response.data.data
    });
  }

  saveMessage() {
    const data = 'Your data';
    this.submitClicked.emit(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
