import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgPlural } from '@angular/common';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
    entryForm: FormGroup;
    modalRef?: BsModalRef;
    submitted = false;
    returnUrl: string;
    modalTitle = "Add New Notification";
    is_authenticated = false;
    currentUser: any = null;

    fileHolder: File | null;

    urls = [];
    files = [];

    notificationList: Array<any> = [];
    is_loaded = false;

    class_id;

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _service: CommonService,
        public formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router
    ) { 
        this.fileHolder = null;
    }

    ngOnInit(): void {
        this.entryForm = this.formBuilder.group({
            id: [null],
            title: [null, [Validators.required]],
            description: [null],
            thumbnail: [''],
            is_active: [true]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/loggin']);
        }

        this.getNotificationList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getNotificationList() {
        this.blockUI.start('Loading...');
        this._service.get('admin/notification-list').subscribe(res => {
            this.notificationList = res.data;
            this.is_loaded = true;
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        }
        );
    }

    onSelectFile(event: any) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                if (event.target.files && event.target.files.length) {
                    this.fileHolder = event.target.files[0];
                }
            }
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    formSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        let params = {
            id: this.entryForm.value.id,
            title: this.entryForm.value.title,
            description: this.entryForm.value.description,
            is_active: this.entryForm.value.is_active,
        }

        const formData = new FormData();

        if(this.fileHolder && this.fileHolder.name){
            formData.append('thumbnail', this.fileHolder, this.fileHolder.name);
        } 

        formData.append('data', JSON.stringify(params));

        this.blockUI.start('Saving...');
        this._service.post('admin/notification-save-or-update', formData).subscribe(
            res => {
                this.blockUI.stop();
                this.modalHide();
                this.getNotificationList();
                this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
                this.urls = [];
                this.files = [];
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
            }
        );
    }

    deleteConfirmModal(item: any, template: TemplateRef<any>){
        this.class_id = item.id;
        this.modalRef = this.modalService.show(template);
    }

    confirmDelete(): void {
        this.modalRef?.hide();
        this.deleteSubmit();
    }
    
    declineDelete(): void {
        this.modalRef?.hide();
        this.class_id = null;
    }

    deleteSubmit(){
        this.blockUI.start('Deleting...');
        let param = {
            id: this.class_id
        }

        this._service.post('admin/notification-delete', param).subscribe(res => {
            this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
            this.blockUI.stop();
            this.modalHide();
            this.getNotificationList();
            this.class_id = null;
        }, err => {
            this.blockUI.stop();
            this.toastr.warning(err.message, 'Attention!', { timeOut: 2000 });
        });
    }

    openEditModal(item: any, template: TemplateRef<any>) 
    {
        this.modalTitle = "Update Notification";
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['title'].setValue(item.title);
        this.entryForm.controls['description'].setValue(item.description);
        this.entryForm.controls['is_active'].setValue(item.is_active);

        this.modalRef = this.modalService.show(template);
    }

    modalHide() {
        this.entryForm.controls['id'].setValue(null);
        this.modalTitle = "Add New Notification";
        this.submitted = false;
        this.modalRef?.hide();
        this.entryForm.reset();
    }

}
