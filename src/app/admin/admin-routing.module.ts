import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ItemComponent } from './item/item.component';
import { PeopleComponent } from './people/people.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'people',
        pathMatch: 'full'
      },
      {
        path: 'people',
        component: PeopleComponent
      },
      {
        path: 'items',
        component: ItemComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
