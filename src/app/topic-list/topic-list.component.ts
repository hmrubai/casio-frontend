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
    selector: 'app-topic-list',
    templateUrl: './topic-list.component.html',
    styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
    entryForm: FormGroup;
    modalRef?: BsModalRef;
    modalTitle = "Add New Video";
    submitted = false;
    returnUrl: string;
    is_authenticated = false;
    currentUser: any = null;
    filter_chapter_id: string = '';

    fileHolder: File | null;

    urls = [];
    files = [];

    classList: Array<any> = [];
    chapterList: Array<any> = [];
    topicList: Array<any> = [];
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
            class_id: [null, [Validators.required]],
            chapter_id: [null, [Validators.required]],
            title: [null, [Validators.required]],
            description: [null],
            // author_name: [null],
            // author_details: [null],
            raw_url: [null],
            s3_url: [null],
            youtube_url: [null],
            download_url: [null],
            duration: [null],
            rating: [5],
            // sequence: [null],
            thumbnail: [''],
            is_active: [true]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/loggin']);
        }

        this.getTopicList();
        this.getClassList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getTopicList() {
        this.blockUI.start('Loading...');
        this._service.get('admin/topic-list').subscribe(res => {
            this.topicList = res.data;
            this.is_loaded = true;
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        }
        );
    }

    getClassList() {
        this.blockUI.start('Loading...');
        this._service.get('admin/class-list').subscribe(res => {
            this.classList = res.data;
            this.is_loaded = true;
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        }
        );
    }

    onChangeClass(event){
        this.entryForm.controls['chapter_id'].setValue(null);
        this.chapterList = [];
        if(!event){
            return;
        }
        this.blockUI.start('Loading...');
        this._service.get('admin/chapter-list-by-id/' + event.id).subscribe(res => {
            this.chapterList = res.data;
            this.is_loaded = true;
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        });
    }

    onChangeClassGetVideo(event){
        if(!event){
            return;
        }
        this.blockUI.start('Loading...');
        let params = {
            class_id: event.id
        }

        this.topicList = [];
        this._service.post('admin/filter-topic-list', params).subscribe(res => {
            this.topicList = res.data;
            this.is_loaded = true;
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        });
    }

    getChapterList() {
        this.blockUI.start('Loading...');
        this._service.get('admin/chapter-list').subscribe(res => {
            this.chapterList = res.data;
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
            title_bn: this.entryForm.value.title,
            description_bn: this.entryForm.value.description,
            class_id: this.entryForm.value.class_id,
            chapter_id: this.entryForm.value.chapter_id,
            // author_name: this.entryForm.value.author_name,
            // author_details: this.entryForm.value.author_details,
            raw_url: this.entryForm.value.raw_url,
            s3_url: this.entryForm.value.s3_url,
            youtube_url: this.entryForm.value.youtube_url,
            download_url: this.entryForm.value.download_url,
            duration: this.entryForm.value.duration,
            rating: this.entryForm.value.rating,
            // sequence: this.entryForm.value.sequence,
            is_active: this.entryForm.value.is_active,
        }

        const formData = new FormData();

        if(this.fileHolder && this.fileHolder.name){
            formData.append('thumbnail', this.fileHolder, this.fileHolder.name);
        } 

        formData.append('data', JSON.stringify(params));

        this.blockUI.start('Saving...');
        this._service.post('admin/topic-save-or-update', formData).subscribe(
            res => {
                this.blockUI.stop();
                this.modalHide();

                if(this.filter_chapter_id){
                    this.onChangeClassGetVideo({id: this.filter_chapter_id});
                }else{
                    this.getTopicList();
                }

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

        this._service.post('admin/topic-delete', param).subscribe(res => {
            this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
            this.blockUI.stop();
            this.modalHide();

            if(this.filter_chapter_id){
                this.onChangeClassGetVideo({id: this.filter_chapter_id});
            }else{
                this.getTopicList();
            }
            
            this.class_id = null;
        }, err => {
            this.blockUI.stop();
            this.toastr.warning(err.message, 'Attention!', { timeOut: 2000 });
        });
    }

    openEditModal(item: any, template: TemplateRef<any>) 
    {
        this.modalTitle = "Update Video";
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['class_id'].setValue(item.class_id);
        this.onChangeClass({id: item.class_id});

        this.entryForm.controls['chapter_id'].setValue(item.chapter_id);
        this.entryForm.controls['title'].setValue(item.title);
        this.entryForm.controls['description'].setValue(item.description);
        // this.entryForm.controls['author_name'].setValue(item.author_name);
        // this.entryForm.controls['author_details'].setValue(item.author_details);
        this.entryForm.controls['raw_url'].setValue(item.raw_url);
        this.entryForm.controls['s3_url'].setValue(item.s3_url);
        this.entryForm.controls['youtube_url'].setValue(item.youtube_url);
        this.entryForm.controls['download_url'].setValue(item.download_url);
        this.entryForm.controls['duration'].setValue(item.duration);
        this.entryForm.controls['rating'].setValue(item.rating);
        // this.entryForm.controls['sequence'].setValue(item.sequence);
        this.entryForm.controls['is_active'].setValue(item.is_active);

        this.modalRef = this.modalService.show(template);
    }

    modalHide() {
        this.modalTitle = "Add New Video";
        this.entryForm.controls['id'].setValue(null);
        this.submitted = false;
        this.modalRef?.hide();
        this.entryForm.reset();
    }

}
