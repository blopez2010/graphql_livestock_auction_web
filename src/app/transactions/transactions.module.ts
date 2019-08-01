import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
    TransactionsRoutingModule
  ],
  declarations: [TransactionsComponent, AuctionComponent]
})
export class TransactionsModule {}
