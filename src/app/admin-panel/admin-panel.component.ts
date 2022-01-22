import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { permission } from '../interfaces/interfaces.component';

@Component({
  selector: 'shakti-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService) { }
    username:string;

  ngOnInit(): void {
    this.onGetCurrentUser();
  }

  onGetCurrentUser = () => {
    this.authService.currentUser.subscribe(user => {
      console.log(user.roles[0].permissions);
      this.username = user.name;
      const permissions = user.roles[0].permissions;
    })
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
