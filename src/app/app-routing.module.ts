import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    {
        path: 'login', component: LoginComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
            }
        ]
    },
    {
        path: 'class-list', 
        children: [
            {
                path: '',
                loadChildren: () => import('./class-list/class-list.module').then(m => m.ClassListModule)
            }
        ]
    },
    {
        path: 'chapter-list', 
        children: [
            {
                path: '',
                loadChildren: () => import('./chapter-list/chapter-list.module').then(m => m.ChapterListModule)
            }
        ]
    },
    {
        path: 'notification-list', 
        children: [
            {
                path: '',
                loadChildren: () => import('./notification-list/notification-list.module').then(m => m.NotificationListModule)
            }
        ]
    },
    {
        path: 'topic-list', 
        children: [
            {
                path: '',
                loadChildren: () => import('./topic-list/topic-list.module').then(m => m.TopicListModule)
            }
        ]
    },
    { path: 'register', component: RegisterComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
