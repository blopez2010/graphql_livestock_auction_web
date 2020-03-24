import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { ActiveEventResolver } from '../shared/resolvers/active-event.resolver';
import { SharedModule } from '../shared/shared.module';
import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
import { BuyersComponent } from './dashboard/buyers/buyers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DonorsComponent } from './dashboard/donors/donors.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    ComponentsModule
  ],
  declarations: [DashboardComponent, WebDataRocksPivot, BuyersComponent, DonorsComponent],
  providers: [ActiveEventResolver]
})
export class ReportsModule { }
