import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shakti-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBrandMaster = () => {
    this.router.navigate(['brand-table'])
  }

  onCompanyMaster = () => {
    this.router.navigate(['company-master-table'])
  }

  onItemMaster = () => {
    this.router.navigate(['item-master-table'])
  }

  onTandCMaster = () => {
    this.router.navigate(['terms-condition-table'])
  }

  onUnitMaster = () => {
    this.router.navigate(['unit-master-table'])
  }

  onDomesticQuotation = () => {
    this.router.navigate(['quotation-table/domestic']);
  }

  onInternationalQuotation = () => {
    this.router.navigate(['quotation-table/international']);
  }
}
