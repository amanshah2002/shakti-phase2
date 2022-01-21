import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserType } from 'src/app/shared/enums/user_type.enum';

@Injectable({
  providedIn: 'root'
})
export class UsertypeInternationalGuard implements CanActivate {
  constructor(private authService: AuthService,private router: Router){}
  UserType = UserType;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.currentUser.pipe(take(1),map(user=>{
        const User =!!user;
        let isUserTypeInternational: boolean = false;
        if(user){
          // user.user_type == UserType.International?isUserTypeInternational = true : isUserTypeInternational = false;
          if(user.user_type == UserType.International || user.user_type == UserType.All){
            isUserTypeInternational = true;
          }else{
            isUserTypeInternational = false;
          }
        }
        if(isUserTypeInternational) return true;

        this.router.navigate(['manage-company/domestic']);
        return false;
      }))
  }

}
