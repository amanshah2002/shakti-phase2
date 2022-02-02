import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'src/app/services/quotation.service';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { filter, catchError } from 'rxjs/operators';

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
  quotationSortKeys = ['sr_no','city','email','company_name','gross_amount','total_amount'];
  quotationSortObject = {}
  searchKeys = ['sr_no','city','email','company_name','gross_amount','total_amount'];
  isDataReceived:boolean = false;

  constructor(
    private quotationService: QuotationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params) => {
      this.id = params['id'];
      this.listQuotations()
      this.initializeSortKeys();
    })
  }

  onAddQuotation = () => {
    this.router.navigate(['phase2/quotation/' + this.id]);
  }

  listQuotations = () => {
    this.quotationService.getQuotation().subscribe((res) => {
      this.isDataReceived = true;
      this.quotationData = res.data.data;
      this.filterQuotation = this.quotationData;
      this.filterQuotationById();
      this.totalLength = this.filterQuotation.length
    }, (error => {
      this.quotationService.displaySnackBar(error);
    }));
  }

  filterQuotationById = () => {
    if (this.id == 'domestic') {
      console.log(this.filterQuotation);
      this.filterQuotation = this.quotationData.filter(element => element.country == 101)
    }else{
      this.filterQuotation = this.quotationData;
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
        },(error => {
          this.quotationService.displaySnackBar(error);
        }))
      } else {
        return
      }
    })
  }

  onSearch = (searchString) => {
    let filterData = [];
    if(searchString == ''){
      console.log(searchString);
      this.filterQuotationById();
      return
    }

    this.searchKeys.map(keys => {
      this.filterQuotation.map((data:any) => {
        if(data[keys].toString().toLowerCase().includes(searchString.toLowerCase())){
          if(filterData.indexOf(data) === -1){
            filterData.push(data);
          }
        }
      })
    })
    this.filterQuotation = filterData;
    console.log(this.filterQuotation);
  }

  initializeSortKeys = () => {
    this.quotationSortKeys.map(keys => {
      this.quotationSortObject[keys] = {
        sortState: false
      }
    })
    console.log(this.quotationSortObject);
  }

  onSort = (sortString: string) => {
    this.quotationSortObject[sortString].sortState = !this.quotationSortObject[sortString].sortState;
    this.quotationSortObject[sortString].sortState ? this.filterQuotation.sort((a, b) => a[sortString] > b[sortString] ? 1 : -1) :
      this.filterQuotation.sort((a, b) => a[sortString] < b[sortString] ? 1 : -1);
  }
}
