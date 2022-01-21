import { map } from 'rxjs/operators';
import { CompanyVisitService } from './../services/company-visit.service';
import { Child, option_item_array } from './../interfaces/interfaces.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BrandManagementService } from './../services/brand-management.service';
import { ItemManagementService } from './../services/item-management.service';
import { TermsConditionsService } from './../services/terms-conditions.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { country, item } from '../interfaces/interfaces.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { QuotationService } from '../services/quotation.service';
import { from, of } from 'rxjs';

const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'shakti-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class QuotationComponent implements OnInit {
  constructor(
    private locationService: LocationService,
    private http: HttpClient,
    private quotationService: QuotationService,
    private route: ActivatedRoute,
    private termsConditionsService: TermsConditionsService,
    private itemManagementService: ItemManagementService,
    private brandManagementService: BrandManagementService,
    private companyVisitService: CompanyVisitService
  ) {}

  quotationType = [{ name: 'Local', value: 1 }];
  tempInqType = [
    { name: 'Domestic', value: 1 },
    { name: 'International', value: 2 },
  ];

  internationalType = [
    { name: 'Export', value: 1 },
    { name: 'Dealer', value: 2 },
  ];

  editMode: boolean = false;
  hideToggle: boolean = false;
  companyList;
  displayedColumns = [
    'itemName',
    'brandName',
    'specification',
    'quantity',
    'rate',
    'amount',
  ];
  edit = false;
  filteredQuotationType;
  id: number | string;
  quotationDetail: any;
  contactPersonObject = {};
  chargesFormArray = new FormArray([]);
  itemDetails: any;
  checked: any;
  countryList = [];
  stateObject = {};
  jsonFrom;
  _router: string;
  itemForm = new FormGroup({
    items: new FormArray([]),
  });
  valueChanged: boolean = false;

  itemArrayControls = <FormArray>this.itemForm.get('items')['controls'];

  quotationForm = new FormGroup({
    id: new FormControl(),
    type: new FormControl(),
    mode_of_inquiry: new FormControl(),
    company_name: new FormControl(),
    contact_person: new FormControl(),
    designation: new FormControl(),
    billing_address: new FormControl(),
    gst_number: new FormControl(),
    country: new FormControl(),
    state: new FormControl(),
    website: new FormControl(),
    reQuotation: new FormControl(0),
    quotation_date: new FormControl(),
    inquiry_type: new FormControl(),
    subject: new FormControl(),
    contact_number: new FormControl(),
    email: new FormControl(),
    plant_address: new FormControl(),
    city: new FormControl(),
  });

  chargesForm = new FormGroup({
    delivery: new FormControl(),
    remarks: new FormControl(),
    total_amount: new FormControl(),
    discount: new FormControl(),
    discount_amount: new FormControl(),
    after_discount_amount: new FormControl(),
    other_charge: new FormControl(),
    other_charge_amount: new FormControl(),
    packing_label: new FormControl(),
    packing_charge: new FormControl(),
    packing_charge_amount: new FormControl(),
    packing_notes: new FormControl(),
    is_forwarding_extra: new FormControl(0),
    forwarding: new FormControl(),
    forwarding_amount: new FormControl(),
    forwarding_notes: new FormControl(),
    document: new FormControl(),
    document_amount: new FormControl(),
    igst: new FormControl(),
    igst_amount: new FormControl(),
    cgst: new FormControl(),
    cgst_amount: new FormControl(),
    sgst: new FormControl(),
    sgst_amount: new FormControl(),
    extra_charge: new FormControl(),
    extra_charge_amount: new FormControl(),
    label_name: new FormControl(),
    extra_label_name: new FormControl(),
    gross_amount: new FormControl(),
  });

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.filterDropDownById();
    this.getCompanies();
    this.chargesForm.controls['after_discount_amount'].disable();

    if (this.id != 'domestic' && this.id != 'international') {
      this.onPatchValue();
    }

    this.onAddItem();

    this.getCountryList();
  }

  onPatchValue = () => {
    this.quotationService.getQuotationById(this.id).subscribe((response) => {
      // console.log(response.data.items)
      if (response) {
        this.quotationDetail = response.data;
        console.log(this.quotationDetail);
        this.editMode = true;
        this.valueChanged = false

        const formattedDate = moment(
          this.quotationDetail['quotation_date'],
          'DD/MM/YYYY'
        );
        quotation_date: this.quotationForm
          .get('quotation_date')
          .setValue(formattedDate);

        this.quotationForm.patchValue({
          id: this.quotationDetail.id,
          type: +this.quotationDetail.type,
          mode_of_inquiry: this.quotationDetail.mode_of_inquiry,
          company_name: this.quotationDetail.company_name,
          contact_person: this.quotationDetail.contact_person,
          designation: this.quotationDetail.designation,
          billing_address: this.quotationDetail.billing_address,
          gst_number: this.quotationDetail.gst_number,
          country: this.quotationDetail.country,
          state: this.quotationDetail.state,
          website: this.quotationDetail.website,
          inquiry_type: this.quotationDetail.inquiry_type,
          subject: this.quotationDetail.subject,
          contact_number: this.quotationDetail.contact_number,
          email: this.quotationDetail.email,
          plant_address: this.quotationDetail.plant_address,
          city: this.quotationDetail.city,
        });


        this.chargesForm.patchValue({
          delivery: this.quotationDetail.delivery,
          remarks: this.quotationDetail.remarks,
          total_amount: this.quotationDetail.total_amount,
          discount: this.quotationDetail.discount,
          discount_amount: this.quotationDetail.discount_amount,
          after_discount_amount: this.quotationDetail.after_discount_amount,
          other_charge: this.quotationDetail.other_charge,
          other_charge_amount: this.quotationDetail.other_charge_amount,
          packing_label: this.quotationDetail.packing_label,
          packing_notes: this.quotationDetail.packing_notes,
          packing_charge: this.quotationDetail.packing_charge,
          packing_charge_amount: this.quotationDetail.packing_charge_amount,
          is_forwarding_extra: this.quotationDetail.is_forwarding_extra,
          forwarding: this.quotationDetail.forwarding,
          forwarding_amount: this.quotationDetail.forwarding_amount,
          forwarding_notes: this.quotationDetail.forwarding_notes,
          document: this.quotationDetail.document,
          document_amount: this.quotationDetail.document_amount,
          igst: this.quotationDetail.igst,
          igst_amount: this.quotationDetail.igst_amount,
          cgst_amount: this.quotationDetail.cgst_amount,
          sgst: this.quotationDetail.sgst,
          sgst_amount: this.quotationDetail.sgst_amount,
          extra_charge: this.quotationDetail.extra_charge,
          extra_charge_amount: this.quotationDetail.extra_charge_amount,
          label_name: this.quotationDetail.label_name,
          extra_label_name: this.quotationDetail.extra_label_name,
          gross_amount: this.quotationDetail.gross_amount,
        });


        this.patchItemOnEdit(response.data.items);

      }
    });

    this.quotationForm.valueChanges.subscribe((response) => {
      this.valueChanged = true;
      console.log('Thalassa Thalassa babyyyyy');
    });
    this.chargesForm.valueChanges.subscribe((response) => {
      this.valueChanged = true;
    });
    this.itemForm.valueChanges.subscribe((response) => {
      this.valueChanged = true;
    });
  };

  canDeactivate() {
    if (this.valueChanged) {
      const result = window.confirm('There are Unsaved Changes! Are You Sure?');
      return of(result);
    }
    return true;
  }

  filterDropDownById = () => {
    let temp = [
      { value: 1, name: 'Domestic' },
      { value: 2, name: 'Export' },
      { value: 3, name: 'Dealer' },
    ];
    if (this.id == 'domestic') {
      this.filteredQuotationType = temp.filter((element) => element.value == 1);
      this.quotationForm.controls.type.setValue(1);
      console.log(this.filteredQuotationType);
    } else if (this.id == 'international') {
      this.filteredQuotationType = temp.filter((element) => element.value != 1);
      console.log(this.filteredQuotationType);
    } else {
      this.filteredQuotationType = temp;
    }
  };

  onPreviewTable = () => {
    document
      .getElementById('preview-table')
      .scrollIntoView({ behavior: 'smooth' });
    if (!this.itemForm.get('items').value) {
      return;
    }
  };

  getCompanies = () => {
    const param = {
      perpage: 0
    }
    this.companyVisitService.getCompanyList(param).subscribe((data) => {
      if (data.data.data) {
        this.companyList = data.data.data;
        this.getContactPerson(this.companyList);
      }
    });
  };

  getContactPerson = (companyList) => {
    companyList.map(company => {
      company.phone.map(contact => {
        this.contactPersonObject[company.company_name] = {
          contactPerson: company.phone,
          number: contact.contact_number
        }
      })
    });
    console.log(this.contactPersonObject);
  }

  setContactPerson = (companyName) => {
    const contactPerson = this.contactPersonObject[companyName.value].contactPerson[0].id;
    console.log(this.contactPersonObject[companyName.value]);
    console.log(contactPerson);
    this.quotationForm.controls.contact_person.setValue(contactPerson);
  }

  setContactNumber = (companyName) => {
    const contactNumber = this.contactPersonObject[companyName.value].number[0].contact_no;
    this.quotationForm.controls.contact_number.setValue(contactNumber);
  }

  onRequotation = (checked) => {
    console.log(+checked);
  };

  onForwarding = (checked) => {
    console.log(+checked);
  };

  getCountryList = () => {
    this.locationService.countryObs.subscribe((data) => {
      if (data) {
        this.countryList = data;
        this.parseCountry(data);
      }
    });
  };

  parseCountry = (countryArray) => {
    countryArray.map((country: country) => {
      this.stateObject[country.id] = {
        states: country.states,
        phoneCode: country.phoneCode,
      };
    });
  };

  patchItemOnEdit = (items: item[]) => {
    const itemArray = <FormArray>this.itemForm.get('items');
    itemArray.removeAt(0); //resetting item form
    items.map((item) => {
      if (item) {
        const itemIndex = items.indexOf(item);
        this.onAddItem();
        if (item.child.length != 0) {
          this.patchSubItemData(item.child, itemIndex, 'child');
        }
        if (item.option_item_array.length != 0) {
          this.patchSubItemData(item.option_item_array, itemIndex, 'option');
        }
      }
    });
    this.itemForm.get('items').patchValue(items);
  };

  patchSubItemData = (subDataArray, index: number, code) => {
    if (code == 'option') {
      subDataArray.map((option: option_item_array) => {
        this.onAddOption(index);
        if (option.child.length != 0) {
          this.patchOptionChild(
            option.child,
            index,
            subDataArray.indexOf(option)
          );
        }
      });
    } else {
      subDataArray.map((child: Child) => {
        this.onAddChild(index);
        if (child.option_child_array.length != 0) {
          child.option_child_array.map((data) => {
            this.onAddOptionToChild(index, subDataArray.indexOf(child));
          });
        }
      });
    }
  };

  patchOptionChild = (
    superSubDataArray,
    superIndex: number,
    parentIndex: number
  ) => {
    superSubDataArray.map((optionChild: Child) => {
      this.onAddOptionChild(superIndex, parentIndex);
      if (optionChild.option_child_array.length != 0) {
        optionChild.option_child_array.map((data) => {
          this.onAddOptionToChildOption(
            superIndex,
            parentIndex,
            superSubDataArray.indexOf(optionChild)
          );
        });
      }
    });
  };

  onAdd = () => {
    if(this.edit){
      this.onUpdateForm();
      return
    }
    const date = new Date(this.quotationForm.get('quotation_date').value);
    const formattedDate = moment(date).format('DD/MM/YYYY');

    const quotation = this.quotationForm.value;
    quotation['quotation_date'] = formattedDate;

    let groupForm = {
      quotation: this.quotationForm.value,
      items: this.itemForm.value.items,
      charges: this.chargesForm.value,
    };
    groupForm["quotation"].reQuotation = +groupForm["quotation"].reQuotation;
    groupForm["charges"].is_forwarding_extra = +groupForm["charges"].is_forwarding_extra;
    console.log(groupForm);
    this.quotationService.postQuotation(groupForm).subscribe((data) => {
      console.log(data);
    });
  };

  onAddItem = () => {
    const control = <FormArray>this.itemForm.get('items');
    control.push(
      new FormGroup({
        id: new FormControl(0),
        item_id: new FormControl(null),
        brand_id: new FormControl(0),
        quantity: new FormControl(null),
        rate: new FormControl(null),
        amount: new FormControl(null),
        specification: new FormControl(null),
        child: new FormArray([]),
        option_item_array: new FormArray([]),
      })
    );
  };

  onAddOption = (parentIndex: number) => {
    this.itemArrayControls[parentIndex].get('option_item_array').push(
      new FormGroup({
        id: new FormControl(0),
        item_id: new FormControl(null),
        brand_id: new FormControl(null),
        quantity: new FormControl(null),
        rate: new FormControl(null),
        amount: new FormControl(null),
        specification: new FormControl(null),
        child: new FormArray([]),
        // childToChild: new FormArray([]),
      })
    );
  };

  onAddChild = (parentIndex: number) => {
    const control = this.itemArrayControls[parentIndex].get('child');
    control.push(
      new FormGroup({
        id: new FormControl(0),
        item_id: new FormControl(null),
        brand_id: new FormControl(null),
        quantity: new FormControl(null),
        rate: new FormControl(null),
        amount: new FormControl(null),
        specification: new FormControl(null),
        option_child_array: new FormArray([]),
      })
    );
  };

  onAddOptionChild = (superIndex: number, parentIndex: number) => {
    const control = this.itemArrayControls[superIndex]
      .get('option_item_array')
      ['controls'][parentIndex].get('child');
    control.push(
      new FormGroup({
        id: new FormControl(0),
        item_id: new FormControl(null),
        brand_id: new FormControl(null),
        quantity: new FormControl(null),
        rate: new FormControl(null),
        amount: new FormControl(null),
        specification: new FormControl(null),
        option_child_array: new FormArray([]),
      })
    );
  };

  onAddOptionToChildOption = (
    superIndex: number,
    parentIndex: number,
    index: number
  ) => {
    const control = this.itemArrayControls[superIndex]
      .get('option_item_array')
      ['controls'][parentIndex].get('child')
      ['controls'][index].get('option_child_array');
    control.push(
      new FormGroup({
        id: new FormControl(0),
        item_id: new FormControl(null),
        brand_id: new FormControl(null),
        quantity: new FormControl(null),
        rate: new FormControl(null),
        amount: new FormControl(null),
        specification: new FormControl(null),
      })
    );
  };

  onAddOptionToChild = (parentIndex: number, index: number) => {
    const control = this.itemArrayControls[parentIndex]
      .get('child')
      ['controls'][index].get('option_child_array');
    control.push(
      new FormGroup({
        id: new FormControl(0),
        item_id: new FormControl(null),
        brand_id: new FormControl(1),
        quantity: new FormControl(null),
        rate: new FormControl(null),
        amount: new FormControl(null),
        specification: new FormControl(null),
        // childToOption: new FormArray([]),
      })
    );
  };

  onRemoveItem = (index) => {
    const control = <FormArray>this.itemForm.get('items');
    control.removeAt(index);
  };

  onRemoveOption = (parentIndex: number, index: number) => {
    const control =
      this.itemArrayControls[parentIndex].get('option_item_array');
    control.removeAt(index);
  };

  onRemoveChild = (parentIndex: number, index: number) => {
    const control = this.itemArrayControls[parentIndex].get('child');
    control.removeAt(index);
  };

  onRemoveOptionChild = (
    superIndex: number,
    parentIndex: number,
    index: number
  ) => {
    const control = this.itemArrayControls[superIndex]
      .get('option_item_array')
      ['controls'][parentIndex].get('child');
    control.removeAt(index);
  };

  onUpdateForm = () => {
    let groupForm = {
      quotation: this.quotationForm.value,
      items: this.itemForm.value.items,
      charges: this.chargesForm.value,
    };
    this.quotationService.updateQuotation(groupForm).subscribe((response) => {
      console.log(response);
      this.valueChanged = false
    });
  };

  onClearForm = () => {
    this.quotationForm.reset();
    this.itemForm.reset();
    this.chargesForm.reset();
  };
}
