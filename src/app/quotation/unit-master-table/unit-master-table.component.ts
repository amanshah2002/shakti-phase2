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
  isUnitsReceived:boolean = false;
  unitDetailsColumns = ['unitShortName', 'unitName', 'status', 'actions']
  constructor(
    private router: Router,
    private unitMasterService: UnitMasterService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.unitMasterService.getUnitMasterList().subscribe(response => {
      if(response){
        this.isUnitsReceived = true;
        console.log(response.data.data);
        this.unitDetails = response.data.data;
        this.totalLength = this.unitDetails.length;
      }
    })
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
      if(data){
        console.log(id);
      }
    })
  }

}
