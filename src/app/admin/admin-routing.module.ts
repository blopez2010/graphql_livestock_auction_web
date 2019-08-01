import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveEventResolver } from '../shared/resolvers/active-event.resolver';
import { EventsResolver } from '../shared/resolvers/events.resolver';
import { PeopleResolver } from '../shared/resolvers/people.resolver';
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
        component: ItemComponent,
        resolve: {
          people: PeopleResolver,
          events: EventsResolver,
          activeEvent: ActiveEventResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
