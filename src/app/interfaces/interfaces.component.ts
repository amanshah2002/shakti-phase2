export interface SignInResponseReq {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface gstDetails {
  gst_number;
  gst_name: string;
  gst_address;
  gst_pin: number;
  length?: number;
  id?: number;
}

export interface changePass {
  current_password: string;
  password: string;
  confirm_password: string;
}

export interface country {
  id: number;
  name: string;
  phoneCode: string;
  states: any[];
}

export interface Control {
  controls: controlKeys[];
}

export interface controlKeys {
  name: string;
  label: string;
  value: string;
  type: string;
  valueArray?: ValueArray[];
  validators: Validators;
}

export interface Validators {
  required: boolean;
}

export interface ValueArray {
  label: string;
  value: number;
}

type optional<t> = {
  [p in keyof t]?: t[p];
};

export type gstFromDetails = optional<gstDetails>;

export interface Quotation {
  id: number;
  type: number;
  mode_of_inquiry: string;
  company_name: string;
  contact_person: number;
  designation: string;
  billing_address: string;
  gst_number: string;
  state: number;
  website: string;
  reQuotation: number;
  quotation_date: string;
  inquiry_type: number;
  subject: string;
  contact_number: string;
  email: string;
  plant_address: string;
  city: string;
  country: number;
}

export interface OptionChildArray {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
}

export interface Child {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  optionChildArray: OptionChildArray[];
}

export interface OptionChildArray {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
}

export interface Child {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  optionChildArray: OptionChildArray[];
}

export interface OptionItemArray {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  child: Child[];
}

export interface Item {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  child: Child[];
  optionItemArray: OptionItemArray[];
}

export interface Charge {
  delivery: string;
  remarks: string;
  total_amount: string;
  discount: string;
  discount_amount: string;
  after_discount_amount: string;
  other_charge: string;
  other_charge_amount: string;
  packing_label: string;
  packing_charge: string;
  packing_charge_amount: string;
  packing_notes: string;
  is_forwarding_extra: number;
  forwarding: string;
  forwarding_amount: string;
  document: string;
  document_amount: string;
  igst: string;
  igst_amount: string;
  cgst: string;
  cgst_amount: string;
  sgst: string;
  sgst_amount: string;
  extra_charge: string;
  extra_charge_amount: string;
  label_name: string;
  extra_label_name: string;
  gross_amount: string;
}

export interface Term {
  id: number;
  group_no: number;
  parameter_name: string;
  parameter_value: string;
}

export interface Delete_item {
  id: number;
}

export interface Delete_term {
  id: number;
}

export interface RootObject {
  quotation: Quotation;
  items: Item[];
  charges: Charge;
  terms: Term[];
  delete_items: Delete_item[];
  delete_terms: Delete_term[];
}

export interface IPreviewTable {
  item: string;
  brandName: string;
  amount: number;
  specification: string
}

export interface item {
  items: any;
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  child: Child[];
  option_item_array: option_item_array[];
}

export interface Child {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  option_child_array: option_child_array[];
}

export interface option_item_array {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
  child: Child[]
}

export interface option_child_array {
  id: number;
  item_id: number;
  brand_id: number;
  quantity: string;
  rate: string;
  amount: string;
  specification: string;
}

export interface brandMaster {
  label: string;
  status: number;
}

export interface permission{
  id:number;
  name:string;
  
}
