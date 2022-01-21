import { MatTooltipModule } from '@angular/material/tooltip';
import { GstDialogComponent } from './shared/dialog/gst-dialog/gst-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from "@angular/material/snack-bar";



import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutComponent } from './core/layout/layout.component';
import { DomesticComponent } from './domestic/domestic.component';
import { InternationalComponent } from './international/international.component';
import { AllComponent } from './all/all.component';
import { UserComponent } from './user/user.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ForgotPasswordDialogComponent } from './auth/forgot-password/forgot-password-dialog.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CompanyVisitDetailsComponent } from './all/company-visit-details/company-visit-details.component';
import { CardDetailDialogComponent } from './shared/dialog/card-detail-dialog/card-detail-dialog.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CompanyCardComponent } from './shared/company-card/company-card.component';
import { ErrorPageComponent } from './error-page/error-page/error-page.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './services/loading.service';
import { LoadingInterceptor } from './services/loading.interceptor';
import { ChangePasswordDialogComponent } from './shared/dialog/change-password/change-password-dialog.component';
import { QuotationComponent } from './quotation/quotation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkColumnDef } from '@angular/cdk/table';
import { QuotationTableComponent } from './quotation/quotation-table/quotation-table.component';
import { CreateBrandComponent } from './quotation/create-brand/create-brand.component';
import { BrandTableComponent } from './quotation/create-brand/brand-table/brand-table.component';
import { CreateItemMasterComponent } from './quotation/create-item-master/create-item-master.component';
import { ItemMasterTableComponent } from './quotation/create-item-master/item-master-table/item-master-table.component';
import { CreateCompanyMasterComponent } from './quotation/create-company-master/create-company-master.component';
import { CompanyMasterTableComponent } from './quotation/create-company-master/company-master-table/company-master-table.component';
import { FollowUpComponent } from './quotation/follow-up/follow-up.component';
import { CompanyDetailReportComponent } from './quotation/company-detail-report/company-detail-report.component';
import { UnitMasterTableComponent } from './quotation/unit-master-table/unit-master-table.component';
import { CreateUnitMasterComponent } from './quotation/unit-master-table/create-unit-master/create-unit-master.component';
import { TermsConditionTableComponent } from './quotation/terms-condition-table/terms-condition-table.component';
import { CreateTermsConditionComponent } from './quotation/terms-condition-table/create-terms-condition/create-terms-condition.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DomesticComponent,
    InternationalComponent,
    AllComponent,
    UserComponent,
    DialogComponent,
    UserDetailComponent,
    ForgotPasswordDialogComponent,
    ForgotPasswordComponent,
    LoadingSpinnerComponent,
    CompanyVisitDetailsComponent,
    CardDetailDialogComponent,
    CompanyCardComponent,
    ErrorPageComponent,
    LoadingComponent,
    GstDialogComponent,
    ChangePasswordDialogComponent,
    QuotationComponent,
    QuotationTableComponent,
    CreateBrandComponent,
    BrandTableComponent,
    CreateItemMasterComponent,
    ItemMasterTableComponent,
    CreateCompanyMasterComponent,
    CompanyMasterTableComponent,
    FollowUpComponent,
    CompanyDetailReportComponent,
    UnitMasterTableComponent,
    CreateUnitMasterComponent,
    TermsConditionTableComponent,
    CreateTermsConditionComponent,
    AdminPanelComponent,

  ],

  imports: [
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSelectFilterModule,
    MatExpansionModule,
    MatTooltipModule,
  ],

  providers: [UserDetailComponent, CdkColumnDef, DialogComponent, LayoutComponent,
    { provide: MAT_DIALOG_DATA,
      useValue: {},
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService, multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
