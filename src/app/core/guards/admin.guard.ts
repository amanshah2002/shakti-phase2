import { UserRoles } from '../../shared/enums/user-roles.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.currentUser.pipe(
        take(1),
        map(user => {
          let isAdmin: boolean = false;
          if(!!user){
            user.role === UserRoles.Admin ? isAdmin = true : isAdmin = false;
          }
          if(isAdmin) return true
          this.router.navigate(['manage-company/all']);
          return false
        })
      )

  }

}
