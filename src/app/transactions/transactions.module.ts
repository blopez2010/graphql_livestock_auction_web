import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { ActiveEventResolver } from '../shared/resolvers/active-event.resolver';
import { SharedModule } from '../shared/shared.module';
import { AuctionComponent } from './auction/auction.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    TransactionsRoutingModule,
    ComponentsModule
  ],
  declarations: [TransactionsComponent, AuctionComponent],
  providers: [ActiveEventResolver]
})
export class TransactionsModule {}
