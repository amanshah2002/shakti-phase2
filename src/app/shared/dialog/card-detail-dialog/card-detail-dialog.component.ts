import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'shakti-card-detail-dialog',
  templateUrl: './card-detail-dialog.component.html',
  styleUrls: ['./card-detail-dialog.component.scss']
})
export class CardDetailDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: string, content: string }) { }
  ngOnInit(): void {

  }

}
