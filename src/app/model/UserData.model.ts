export class UserDataArray {
  public userName: string;
  public userRole: string;
  public userEmail: string;
  public userCountry: string;
  public PhoneNumber: string;
  public password: string;
  public confirmPassword: string;
  public id?: any;
  public userType: any;
  constructor(userName: string, userRole: string, userEmail: string, userCountry: string, PhoneNumber: string, password: string, confirmPassword: string, userType: any) {
    this.userName = userName;
    this.userRole = userRole;
    this.userEmail = userEmail;
    this.userCountry = userCountry;
    this.PhoneNumber = PhoneNumber;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.userType = userType;
  }
}


