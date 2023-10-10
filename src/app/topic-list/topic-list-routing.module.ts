import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list.component';

const routes: Routes = [
  {
    path: '',
    component: TopicListComponent,
    data: {
      title: 'Topic List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicListRoutingModule { }
