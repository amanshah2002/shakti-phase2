import { take, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserType } from 'src/app/shared/enums/user_type.enum';

@Injectable({
  providedIn: 'root'
})
export class UsertypeAllGuard implements CanActivate {

  UserType = UserType;
  constructor(private authService: AuthService,private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.currentUser.pipe(take(1),map(user=>{
        const User =!!user;
        let isUserTypeAll: boolean = false;
        if(user){
          user.user_type == UserType.All?isUserTypeAll = true : isUserTypeAll = false;

        }
        if(isUserTypeAll) return true;
        this.navigateByUserType(user.user_type);
        return false;
      }))

  }
  navigateByUserType = (userType) => {
    userType == '6'?this.router.navigate(['manage-company/domestic']) : this.router.navigate(['manage-company/international']);
  }
}
