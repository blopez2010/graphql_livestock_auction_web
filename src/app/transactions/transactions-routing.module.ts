import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuComponent } from '../shared/menu/menu.component';
import { ActiveEventResolver } from '../shared/resolvers/active-event.resolver';
import { EventsResolver } from '../shared/resolvers/events.resolver';
import { PeopleResolver } from '../shared/resolvers/people.resolver';
import { AuctionComponent } from './auction/auction.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
	{
		path: '',
		component: MenuComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'list' },
			{
				path: 'list',
				component: TransactionsComponent
			},
			{
				path: 'auction',
				component: AuctionComponent,
				resolve: {
					activeEvent: ActiveEventResolver,
					people: PeopleResolver,
					events: EventsResolver
				},
				runGuardsAndResolvers: 'always'
			}
		]
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class TransactionsRoutingModule {}
