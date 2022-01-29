import { TermsConditionTableComponent } from './quotation/terms-condition-table/terms-condition-table.component';
import { UnitMasterTableComponent } from './quotation/unit-master-table/unit-master-table.component';
import { CreateUnitMasterComponent } from './quotation/unit-master-table/create-unit-master/create-unit-master.component';
import { CompanyMasterTableComponent } from './quotation/create-company-master/company-master-table/company-master-table.component';
import { CreateItemMasterComponent } from './quotation/create-item-master/create-item-master.component';
import { BrandTableComponent } from './quotation/create-brand/brand-table/brand-table.component';
import { QuotationTableComponent } from './quotation/quotation-table/quotation-table.component';
import { QuotationComponent } from './quotation/quotation.component';

import { CompanyCanDeactivateGuard } from './all/company-visit-details/company-can-deactivate.guard';
import { ErrorPageComponent } from './error-page/error-page/error-page.component';
import { UsertypeInternationalGuard } from './core/guards/usertype-international.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { CompanyVisitDetailsComponent } from './all/company-visit-details/company-visit-details.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { DomesticComponent } from './domestic/domestic.component';
import { InternationalComponent } from './international/international.component';
import { CanDeactivateGuard } from './user/can-deactivate.guard';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserComponent } from './user/user.component';
import { AuthPathGuard } from './core/guards/auth-path.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { UsertypeAllGuard } from './core/guards/usertypeAll.guard';
import { UsertypeDomesticGuard } from './core/guards/usertypeDomestic.guard';
import { CreateBrandComponent } from './quotation/create-brand/create-brand.component';
import { ItemMasterTableComponent } from './quotation/create-item-master/item-master-table/item-master-table.component';
import { CreateCompanyMasterComponent } from './quotation/create-company-master/create-company-master.component';
import { FollowUpComponent } from './quotation/follow-up/follow-up.component';
import { CompanyDetailReportComponent } from './quotation/company-detail-report/company-detail-report.component';
import { CreateTermsConditionComponent } from './quotation/terms-condition-table/create-terms-condition/create-terms-condition.component';
import { QuotationGuard } from './core/guards/quotation.guard';
import { MarketingGuard } from './core/guards/marketing.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent, canActivate: [AuthPathGuard] },
  { path: 'forgot-password/:code', component: ForgotPasswordComponent },
  {
    path: 'manage-company', canActivate: [MarketingGuard],
    children: [
      {
        path: 'all',
        component: AllComponent,
        canActivate: [AuthGuard, UsertypeAllGuard],
      },
      {
        path: 'international',
        component: InternationalComponent,
        canActivate: [AuthGuard, UsertypeInternationalGuard],
      },
      {
        path: 'domestic',
        component: DomesticComponent,
        canActivate: [AuthGuard, UsertypeDomesticGuard],
      },
    ],
  },

  {
    path: 'company-visit-details/:id',
    component: CompanyVisitDetailsComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard,MarketingGuard],
    canDeactivate: [CompanyCanDeactivateGuard],
  },

  {path: 'phase2', canActivate: [QuotationGuard, AuthGuard],
    children: [
      { path: 'quotation/:id', component: QuotationComponent },
      { path: 'quotation-table/:id', component: QuotationTableComponent },
      { path: 'brand-table', component: BrandTableComponent },//done search
      { path: 'brand-table/:id', component: CreateBrandComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'item-table', component: ItemMasterTableComponent },//done search
      { path: 'item-table/:id', component: CreateItemMasterComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'company-master-table', component: CompanyMasterTableComponent },//done doubt search
      { path: 'company-master-table/:id', component: CreateCompanyMasterComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'unit-master-table', component: UnitMasterTableComponent },//done search
      { path: 'unit-master-table/:id', component: CreateUnitMasterComponent, canDeactivate: [CanDeactivateGuard] },

      { path: 'terms-condition-table', component: TermsConditionTableComponent },//done search
      { path: 'terms-condition-table/:id', component: CreateTermsConditionComponent },
    ]},

  {
    path: 'users',
    canActivate: [AuthGuard, AdminGuard, MarketingGuard],
    children: [
      { path: '', component: UserComponent },
      {
        path: 'user-detail',
        children: [
          {
            path: ':id',
            component: UserDetailComponent,
            canDeactivate: [CanDeactivateGuard],
          },
        ],
      },
    ],
  },
  { path: '**', component: ErrorPageComponent },
];

// TODO: doubt in company search.
// TODO: implement error handling.
// TODO: re-quotation working but response is error 500.
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
