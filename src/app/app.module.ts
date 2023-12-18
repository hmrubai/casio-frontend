import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ChapterListComponent } from './chapter-list/chapter-list.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { TopicListComponent } from './topic-list/topic-list.component';
import { SHopListComponent } from './shop-list/shop-list.component';
import { OsdListComponent } from './osd-list/osd-list.component';
import { ManualBookComponent } from './manual-book/manual-book.component';
import { QueryListComponent } from './query-list/query-list.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BlockUIModule } from 'ng-block-ui';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MathjaxModule } from "mathjax-angular";
import { NgSelectModule } from '@ng-select/ng-select';

import { TruncatePipe } from './_helpers/truncate-pipe';

@NgModule({
  declarations: [
    AppComponent,
    TruncatePipe,
    SidebarNavComponent,
    TopNavComponent,
    FooterComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    ClassListComponent,
    ChapterListComponent,
    NotificationListComponent,
    TopicListComponent,
    SHopListComponent,
    OsdListComponent,
    QueryListComponent,
    ManualBookComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BlockUIModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    MathjaxModule.forRoot(),
    NgSelectModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
