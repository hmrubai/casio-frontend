import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SHopListComponent } from './shop-list.component';

const routes: Routes = [
  {
    path: '',
    component: SHopListComponent,
    data: {
      title: 'Shop/Dealer List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SHopListRoutingModule { }
