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
    selector: 'app-manual-book',
    templateUrl: './manual-book.component.html',
    styleUrls: ['./manual-book.component.scss']
})
export class ManualBookComponent implements OnInit {
    entryForm: FormGroup;
    modalRef?: BsModalRef;
    submitted = false;
    returnUrl: string;
    modalTitle = "Add New Manual";
    is_authenticated = false;
    currentUser: any = null;

    fileHolder: File | null;

    urls = [];
    files = [];

    bookList: Array<any> = [];
    manualBook: any = null;
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
            book_title: [null, [Validators.required]],
            description: [null],
            attachment: [''],
            is_active: [true]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/loggin']);
        }

        this.getManualList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getManualList() {
        this.blockUI.start('Loading...');
        this._service.get('admin/get-manual').subscribe(res => {
            this.bookList = res.data;
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
            if (event.target.files && event.target.files.length) {
                this.fileHolder = event.target.files[0];
            }
            // if (event.target.files[0].size > 2000000){
            //     this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
            //     return;
            // }else{
            //     if (event.target.files && event.target.files.length) {
            //         this.fileHolder = event.target.files[0];
            //     }
            // }
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
            book_title: this.entryForm.value.book_title,
            description: this.entryForm.value.description,
            is_active: this.entryForm.value.is_active,
        }

        const formData = new FormData();

        if(this.fileHolder && this.fileHolder.name){
            formData.append('manual', this.fileHolder, this.fileHolder.name);
        } 

        formData.append('data', JSON.stringify(params));

        this.entryForm.value.id ? this.blockUI.start('Updating...') : this.blockUI.start('Saving...');
        this._service.post('admin/update-manual-book', formData).subscribe(
            res => {
                this.blockUI.stop();
                this.modalHide();
                this.getManualList();
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

        this._service.post('admin/class-delete', param).subscribe(res => {
            this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
            this.blockUI.stop();
            this.modalHide();
            this.getManualList();
            this.class_id = null;
        }, err => {
            this.blockUI.stop();
            this.toastr.warning(err.message, 'Attention!', { timeOut: 2000 });
        });
    }

    openEditModal(item: any, template: TemplateRef<any>) 
    {
        this.modalTitle = "Update Manual";
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['book_title'].setValue(item.title);
        this.entryForm.controls['description'].setValue(item.description);
        this.entryForm.controls['is_active'].setValue(item.is_active);

        this.modalRef = this.modalService.show(template);
    }

    onLoginSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        this.blockUI.start('Loading...');

        this.authService.login(this.entryForm.value).subscribe(
            data => {
                console.log(data);

                if (data.status === 400) {
                    this.toastr.error('Unauthorized request found', 'Error!', { timeOut: 3000 });
                    this.blockUI.stop();
                    return;
                } else if (data.status === 401) {
                    this.toastr.error('Invalid Username Or Password', 'Error!', { timeOut: 3000 });
                    this.blockUI.stop();
                    return;
                } else if (data.status === 409) {
                    this.toastr.error('Invalid Username Or Password', 'Error!', { timeOut: 3000 });
                    this.blockUI.stop();
                    return;
                }

                if (data.status) {
                    this.toastr.success('Logging Successfully', 'Success!', { timeOut: 2000 });
                    this.router.navigate(['/index']).then(() => {
                        this.blockUI.stop();
                        window.location.reload();
                    });
                } else {
                    this.toastr.error(data.message, 'Error!', { timeOut: 3000 });
                    this.blockUI.stop();
                }
            },
            error => {
                this.blockUI.stop();
                if (error.status === 400) {
                    this.toastr.error('Unauthorized request found', 'Error!', { timeOut: 3000 });
                } else if (error.status === 401) {
                    this.toastr.error('Invalid Email Or Password', 'Error!', { timeOut: 3000 });
                } else if (error.status === 409) {
                    this.toastr.error('Invalid Email Or Password', 'Error!', { timeOut: 3000 });
                }
            }
        );
    }

    modalHide() {
        this.entryForm.controls['id'].setValue(null);
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = "Add New Manual";
        this.submitted = false;
        this.modalRef?.hide();
        this.entryForm.reset();
    }

}
