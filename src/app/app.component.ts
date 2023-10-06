import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CASIO Admin';

  is_authenticated = false;
  currentUser: any = null;
  returnUrl: string;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) 
  {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (!this.authService.isAuthenticated()) {
      this.is_authenticated = false;
      this.router.navigate(['/login']);
    }else{
      this.is_authenticated = true;
    }

  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  isRegisterPage(): boolean {
    return this.router.url.includes('/register');
  }
}
