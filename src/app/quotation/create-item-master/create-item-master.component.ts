import { ActivatedRoute } from '@angular/router';
import { ItemManagementService } from './../../services/item-management.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { runInThisContext } from 'vm';

@Component({
  selector: 'shakti-create-item-master',
  templateUrl: './create-item-master.component.html',
  styleUrls: ['./create-item-master.component.scss']
})
export class CreateItemMasterComponent implements OnInit {
  id
  itemDetails
  constructor(private itemManagementService: ItemManagementService, private route: ActivatedRoute) { }

  itemStatus:boolean = false;

  createItemForm = new FormGroup({
    id: new FormControl(0),
    item_code: new FormControl(null),
    item_name: new FormControl(null),
    item_unit: new FormControl(null),
    item_specification: new FormControl(null),
    brochure_specification: new FormControl(null),
    item_file: new FormControl(null),
    item_status: new FormControl(0),
  });

  itemDetailsForm = new FormGroup({
    id: new FormControl(0),
    item_id: new FormControl(null),
    brand_id: new FormControl(null),
    rate: new FormControl(null),
  })

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.itemManagementService.getListItemDetails(this.id).subscribe(response => {
      // console.log(response);
      this.itemDetailsForm.patchValue(response.data)
      })

      this.itemManagementService.getItemMasterById(this.id).subscribe(response => {
        console.log(response);
      })

    this.itemManagementService.getItemMasterById(this.id).subscribe(response => {
      // console.log(response.data);
      this.itemDetails = response.data
      this.createItemForm.patchValue(response.data)
      this.createItemForm.controls.item_status.setValue(response.data.item_status == '1' ? true : false)
      // this.itemDetailsForm.patchValue(response.data)
    })
  }

  onToggleStatus = (event) => {
    this.itemStatus = !this.itemStatus;
  }

  onAdd = () => {
    const item = this.createItemForm.value
    const itemDetail = this.itemDetailsForm.value
    item['item_status'] = 1;
    this.itemManagementService.createItemMaster(item).subscribe(data => {
      console.log(data);
    },(error => {
      console.error(error);
    }));
    this.itemManagementService.createItemDetails(itemDetail).subscribe(response => {
      console.log(response);
    }, (error => {
      console.error(error);
    }))
  }

  onClear = () => {
    this.createItemForm.reset();
    this.itemDetailsForm.reset();
  }

}
