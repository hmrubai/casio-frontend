import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { ToastrModule } from 'ngx-toastr';

import { ManualBookRoutingModule } from './manual-book-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManualBookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule,
    ToastrModule
  ]
})
export class ManualBookModule { }
