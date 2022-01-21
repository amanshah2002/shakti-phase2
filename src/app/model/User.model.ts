export class UserModel {
  public name: string;
  public email: string;
  public token: string;
  public role: string;
  public user_type: string
  public user_country: string
  constructor(name: string,email: string, token: string,role: string,user_type: string,user_country: string) {
    this.email = email;
    this.token = token;
    this.role=role;
    this.name = name;
    this.user_type = user_type;
    this.user_country = user_country;
  }
}
