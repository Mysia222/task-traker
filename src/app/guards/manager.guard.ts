import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ManagerGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Function to check if user is manager
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    if (this.authService.isManager()) {
      return true; // Return true: User is allowed to view route
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false; // Return false: user not authorized to view page
    }
  }
}