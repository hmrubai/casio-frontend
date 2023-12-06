import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OsdListComponent } from './osd-list.component';

const routes: Routes = [
  {
    path: '',
    component: OsdListComponent,
    data: {
      title: 'Shop List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OsdListRoutingModule { }
