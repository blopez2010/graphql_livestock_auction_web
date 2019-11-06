import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionGuard } from './shared/guards/session.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((mod) => mod.HomeModule),
    canActivate: [SessionGuard]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./authentication/authentication.module').then((mod) => mod.AuthenticationModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((mod) => mod.AdminModule),
    canActivate: [SessionGuard]
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.module').then((mod) => mod.TransactionsModule),
    canActivate: [SessionGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
