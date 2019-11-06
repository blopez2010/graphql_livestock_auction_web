import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionGuard } from '../shared/guards/session.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [SessionGuard],
    component: HomeComponent,
    children: [{ path: '', pathMatch: 'full', component: DashboardComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
