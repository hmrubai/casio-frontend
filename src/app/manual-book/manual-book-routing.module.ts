import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualBookComponent } from './manual-book.component';

const routes: Routes = [
  {
    path: '',
    component: ManualBookComponent,
    data: {
      title: 'Manual Book'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualBookRoutingModule { }
