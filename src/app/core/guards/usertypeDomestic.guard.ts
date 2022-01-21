import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserType } from 'src/app/shared/enums/user_type.enum';

@Injectable({
  providedIn: 'root'
})
export class UsertypeDomesticGuard implements CanActivate {
  constructor(private authService: AuthService, private router:Router){}
  UserType = UserType;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.currentUser.pipe(take(1),map(user=>{
        const User =!!user;
        let isUserTypeDomestic: boolean = false;
        if(user){
          // user.user_type == UserType.Domestic?isUserTypeDomestic = true : isUserTypeDomestic = false;
          if(user.user_type == UserType.Domestic || user.user_type == UserType.All){
            isUserTypeDomestic = true;
          }else{
            isUserTypeDomestic = false;
          }
        }
        if(isUserTypeDomestic) return true;
        this.router.navigate(['manage-company/international']);
        return false;
      }))

  }


  }
