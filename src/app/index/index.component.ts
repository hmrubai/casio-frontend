import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    is_authenticated = false;
    currentUser: any = null;
    returnUrl: string;

    dashboard_summary: Array<any> = [];
    classList: Array<any> = [];
    notificationList: Array<any> = [];
    is_loaded = false;

    class_count = 0;
    chapter_count = 0;
    topic_count = 0;
    shop_count = 0;

    public settings: any = {};
    banner_image = 'assets/images/saas-banner.jpeg';

    constructor(
        private _service: CommonService,
        public formBuilder: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
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

        this.getSummary();
    }
    
    getSummary() {
        this.blockUI.start('Loading...');
        this._service.get('admin/dashboard-summary').subscribe(res => {
                this.dashboard_summary = res.data;

                this.class_count = res.data.class_count;
                this.chapter_count = res.data.chapter_count;
                this.topic_count = res.data.topic_count;
                this.shop_count = res.data.store_count;

                this.classList = res.data.class_list;
                this.notificationList = res.data.top_notification_list;

                this.is_loaded = true;
                this.blockUI.stop();
            }, err => {
                this.blockUI.stop();
            }
        );
    }

    //

}
