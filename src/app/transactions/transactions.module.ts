import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { ComponentsModule } from '../components/components.module';
import { ActiveEventResolver } from '../shared/resolvers/active-event.resolver';
import { SharedModule } from '../shared/shared.module';
import { AuctionComponent } from './auction/auction.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { FiltersComponent } from './transactions/filters/filters.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		TransactionsRoutingModule,
		ComponentsModule,
		NgxMaskModule.forRoot()
	],
	declarations: [ TransactionsComponent, AuctionComponent, FiltersComponent ],
	providers: [ ActiveEventResolver ]
})
export class TransactionsModule {}
