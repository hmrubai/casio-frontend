import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { Cookie } from 'ng2-cookies';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

    is_authenticated = false;
    menuList: Array<any> = [];
    returnUrl: string;
    is_menu_loaded = false;
    is_site_loaded = false;

    public user_role = null;
    public currentUser: any = {};

    public websiteSettings: any = {};

    profile_image = 'assets/img/avatars/2815428.png';
    site_logo = 'assets/images/lms_logo-1.png';

    constructor(
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router
    ) { 
        if (this.authService.isAuthenticated()) {
            this.is_authenticated = true;

            this.currentUser = this.authService.currentUserDetails.value;
            this.user_role = this.currentUser.user_type;

            if (this.currentUser.image) {
                this.profile_image = environment.imageURL + this.currentUser.image
            }
        }
    }

    ngOnInit(): void {
        // this.getMenuList();
        // this.organizationSettings();
    }

    clientLogout(){
        this.is_authenticated = false;
        this.authService.clientLogout('localhost');
    }

    getMenuList() {
        this._service.get('website/menu-list').subscribe(res => {
            this.menuList = res.data;
            this.is_menu_loaded = true;
            //this.blockUI.stop();
        }, err => {
            //this.blockUI.stop();
        }
        );
    }

    organizationSettings(){
        this._service.get('website/organization-details-by-id/1').subscribe(res => {
                this.websiteSettings = res.data;
                //console.log(this.websiteSettings);
                if(this.websiteSettings.logo){
                    this.site_logo = environment.imageURL + this.websiteSettings.logo
                }

                let expireDate = new Date('2030-07-19');
                Cookie.set('.BBSAASLMS.SiteSettings', JSON.stringify(this.websiteSettings), expireDate, '/', window.location.hostname, false);
                this.is_site_loaded = true;
                //this.blockUI.stop();
            }, err => {
                //this.blockUI.stop();
            }
        );
    }

    GotoPage(type: any, item: any){
        if(item.is_course){
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/course-list/', item.id]);
        }
        if(item.is_content){
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/content-list/', item.id]);
        }
    }

    gotoSubPage(type:any, item: any, sub_item:any){

        if(item.is_course){
            this.router.navigate(['/course-details/', sub_item.sub_menu_id]).then(() => {
                window.location.reload();
            });
            // this.router.navigate(['/course-details/', sub_item.sub_menu_id ]);
        }
        if(item.is_content){
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/content-subject-list/', sub_item.sub_menu_id ]);
            //this.router.navigate(['/content-details/', sub_item.sub_menu_id ]);
        }
    }

    userLogout() {
        this.authService.logout(window.location.hostname);
        Cookie.delete('.CASIO.Cookie', '/', window.location.hostname);
        this.authService.currentUserDetails.next(null);
        this.toastr.success('Logout Successfully', 'Success!', { timeOut: 2000 });
        this.router.navigate(['/index']).then(() => {
            window.location.reload();
        });
    }

    isDropdownOpen = false;
    isDropdown2Open = false;
    isDropdown3Open = false;
    isDropdown4Open = false;
    isDropdown5Open = false;
    isDropdown6Open = false;
    isDropdown7Open = false;
    isDropdown8Open = false;
    isDropdownLoginOpen = false;
    
    showDropdown(): void {
        this.isDropdownOpen = true;
    }

    hideDropdown(): void {
        this.isDropdownOpen = false;
    }

    showDropdown2(): void {
        this.isDropdown2Open = true;
    }

    hideDropdown2(): void {
        this.isDropdown2Open = false;
    }

    showDropdown3(): void {
        this.isDropdown3Open = true;
    }

    hideDropdown3(): void {
        this.isDropdown3Open = false;
    }

    showDropdown4(): void {
        this.isDropdown4Open = true;
    }

    hideDropdown4(): void {
        this.isDropdown4Open = false;
    }

    showDropdown5(): void {
        this.isDropdown5Open = true;
    }

    hideDropdown5(): void {
        this.isDropdown5Open = false;
    }

    showDropdown6(): void {
        this.isDropdown6Open = true;
    }

    hideDropdown6(): void {
        this.isDropdown6Open = false;
    }

    showDropdownLogin(): void {
        this.isDropdownLoginOpen = true;
    }

    hideDropdownLogin(): void {
        this.isDropdownLoginOpen = false;
    }
}
