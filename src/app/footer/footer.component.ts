import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    public footerSettings: any = {};
    site_logo = 'assets/images/lms_logo-1.png';


    constructor() 
    {
        if (Cookie.check('.BBSAASLMS.SiteSettings'))
            this.footerSettings = JSON.parse(Cookie.get('.BBSAASLMS.SiteSettings'));
    }

    ngOnInit(): void {
        if(this.footerSettings.logo){
            this.site_logo = environment.imageURL + this.footerSettings.logo
        }
    }

}
