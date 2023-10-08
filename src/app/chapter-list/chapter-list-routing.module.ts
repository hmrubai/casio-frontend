import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChapterListComponent } from './chapter-list.component';

const routes: Routes = [
  {
    path: '',
    component: ChapterListComponent,
    data: {
      title: 'Chapter List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChapterListRoutingModule { }
