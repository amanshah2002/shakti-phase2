import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'src/app/services/quotation.service';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'shakti-quotation-table',
  templateUrl: './quotation-table.component.html',
  styleUrls: ['./quotation-table.component.scss'],
})
export class QuotationTableComponent implements OnInit {
  id;
  p: number = 1
  totalLength: number
  showDelay = new FormControl(500)
  quotationData = [];
  filterQuotation = [];
  displayedColumns = [
    'itemId',
    'city',
    'email',
    'companyName',
    'amount',
    'totalAmount',
    'actions',
  ];

  constructor(
    private quotationService: QuotationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.listQuotations()
  }

  onAddQuotation = () => {
    this.router.navigate(['phase2/quotation/' + this.id]);
  }

  listQuotations = () => {
    this.quotationService.getQuotation().subscribe((res) => {
      this.quotationData = res.data.data;
      this.filterQuotation = this.quotationData;
      this.filterQuotationById();
      this.totalLength = this.filterQuotation.length
    });
  }

  filterQuotationById = () => {
    if (this.id == 'domestic') {
      console.log(this.filterQuotation);
      this.filterQuotation = this.quotationData.filter(element => element.country == 101)
    }
  }

  onEditQuotation = (id) => {
    this.router.navigate(['phase2/quotation/' + id]);
  };

  onDeleteQuotation = (id) => {
    const dialogref = this.dialog.open(DialogComponent, {
      data: { header: 'Are you sure?', content: 'If you proceed, you will loose all your data for this quotation. Are you sure you want to delete?', yesBtn: 'Yes, delete it!', noBtn: 'No, cancel it!' },
      autoFocus: false,
    });
    dialogref.afterClosed().subscribe(data => {
      if (data) {
        this.quotationService.deleteQuotation(id).subscribe(response => {
          console.log(response);
          if (response) {
            this.listQuotations();
          }
        })
      } else {
        return
      }
    })
  }
}
