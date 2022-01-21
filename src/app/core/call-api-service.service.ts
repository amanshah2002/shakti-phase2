import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CallAPIService {
  baseUrl: string = environment.baseUrl;

  public headers = new HttpHeaders();

  constructor(private http: HttpClient, public router: Router) { }

  public setHeaders() {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
    });
  }

  public callGetAPI(url, paramsObject?) {
    this.setHeaders();
    const params = this.getHttpParams(paramsObject);
    return this.http
      .get(this.baseUrl + url, { headers: this.headers, params })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public callPostAPI(url, data, id?) {
    this.setHeaders();
    return this.http
      .post(this.baseUrl + url, data, { headers: this.headers })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public callDeleteAPI(url) {
    this.setHeaders();
    return this.http.delete(this.baseUrl + url, { headers: this.headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public callPutAPI(url, paramsObject?, data?) {
    this.setHeaders();
    const params = this.getHttpParams(paramsObject);
    return this.http
      .put(this.baseUrl + url, data, { headers: this.headers, params })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  private getHttpParams(object?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (object) {
      Object.keys(object).map((key) => {
        params = params.set(key, object[key]);
      });
    }
    return params;
  }

  public callGetCSVAPI(url, paramsObject?) {
    let headers = new HttpHeaders({
      Accept: 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet'
    });

    const params = this.getHttpParams(paramsObject);

    return this.http
      .get(this.baseUrl + url, { headers, params, responseType: "arrayBuffer" as any })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
