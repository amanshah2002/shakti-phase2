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
    this.router.navigate(['phase2/brand-table'])
  }

  onCompanyMaster = () => {
    this.router.navigate(['phase2/company-master-table'])
  }

  onItemMaster = () => {
    this.router.navigate(['phase2/item-table'])
  }

  onTandCMaster = () => {
    this.router.navigate(['phase2/terms-condition-table'])
  }

  onUnitMaster = () => {
    this.router.navigate(['phase2/unit-master-table'])
  }

  onDomesticQuotation = () => {
    this.router.navigate(['phase2/quotation-table/domestic']);
  }

  onInternationalQuotation = () => {
    this.router.navigate(['phase2/quotation-table/international']);
  }
}
