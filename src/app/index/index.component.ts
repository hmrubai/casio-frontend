import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    is_authenticated = false;
    currentUser: any = null;
    returnUrl: string;

    public settings: any = {};
    banner_image = 'assets/images/saas-banner.jpeg';

    constructor(
        private router: Router, 
        private activatedRoute: ActivatedRoute,
        private authService: AuthenticationService
    ) {
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit(): void {
        if (this.settings.banner) {
            this.banner_image = environment.imageURL + this.settings.banner
        }
    }

}
