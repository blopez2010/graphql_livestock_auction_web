import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SessionGuard } from "../shared/guards/session.guard";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "", canActivate: [SessionGuard], component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
