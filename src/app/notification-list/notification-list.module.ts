import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { ToastrModule } from 'ngx-toastr';

import { NotificationListRoutingModule } from './notification-list-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule,
    ToastrModule
  ]
})
export class NotificationListModule { }
