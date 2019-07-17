import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from './shared/guards/session.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: 'src/app/home/home.module#HomeModule',
    canActivate: [SessionGuard]
  },
  {
    path: 'auth',
    loadChildren:
      'src/app/authentication/authentication.module#AuthenticationModule'
  },
  {
    path: 'admin',
    loadChildren: 'src/app/admin/admin.module#AdminModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
