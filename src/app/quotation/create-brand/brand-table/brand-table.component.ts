import { MatDialog } from '@angular/material/dialog';
import { BrandManagementService } from 'src/app/services/brand-management.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

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
  constructor(
    private brandManagementService: BrandManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.brandManagementService.getBrandMasterList().subscribe((res) => {
      // console.log(res.data.data);
      this.brandData = res.data.data;
      this.totalLength = this.brandData.length
    });
  }

  onAddBrand = () => {
    this.router.navigate(['brand-table/new']);
  }

  onEditBrand = (id) => {
    this.router.navigate(['brand-table/' + id]);
  }

  onDeleteBrand = (id) => {
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
}
