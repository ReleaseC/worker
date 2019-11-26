import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './authguard.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    public cookieService: CookieService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard#canActivate called');
    console.log('this.authService.isConfirm=' + this.authService.isConfirm);

    const currentCookie = this.cookieService.get('AnnoToolExpire');
    const checkCookie = this.authService.formatDate(new Date().getTime());
    if ((currentCookie === '') || (currentCookie === checkCookie)) {
      // this.authService.returnURL = route.url.join('');
      // console.log('returnURL=' + this.authService.returnURL);
      this.authService.params = route.queryParams;
      if (this.authService.isConfirm) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    } else {
       return true;
    }
  }
}
