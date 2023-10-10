import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryListComponent } from './query-list.component';

const routes: Routes = [
  {
    path: '',
    component: QueryListComponent,
    data: {
      title: 'Query List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryListRoutingModule { }
