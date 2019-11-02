import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createTransaction } from '../graphql/types-definitions';
import { getTotalAmountByEvent, getTransactionsPaginated } from '../graphql/types-definitions/transactions/queries';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	constructor(private apollo: Apollo) {}

	/**
   * donate
   */
	public donate(transaction: any): Observable<any> {
		return this.apollo.mutate({
			mutation: createTransaction,
			variables: {
				input: {
					...transaction,
					id: undefined,
					isDonated: true,
					isLastBuyer: false
				}
			}
		});
	}

	/**
   * pay
   */
	public buy(transaction: any): Observable<any> {
		return this.apollo.mutate({
			mutation: createTransaction,
			variables: {
				input: {
					...transaction,
					id: undefined,
					isDonated: false,
					isLastBuyer: true
				}
			}
		});
	}

	/**
   * getTotalAmountByEvent
   */
	public getTotalAmountByEvent(eventId: string) {
		return this.apollo
			.query({
				query: getTotalAmountByEvent,
				variables: {
					eventId
				}
			})
			.pipe(
				map((result) => {
					return { data: result.data['getTotalsByEvent'] };
				})
			);
	}

	/**
	 * getPaginated
	 */
	public getPaginated(filters: any, sortColumn: string, sortDirection: string, offset: number, limit: number) {
		const newFilters = {
			...filters
		};

		Object.keys(newFilters).forEach((key) => (!newFilters[key] ? (newFilters[key] = undefined) : newFilters[key]));
		return this.apollo
			.query({
				query: getTransactionsPaginated,
				variables: {
					input: {
						filters: newFilters,
						sortColumn,
						sortDirection,
						offset,
						limit
					}
				}
			})
			.pipe(
				map((result) => ({
					data: result.data['allTransactionsPaginated']['transactions'],
					totalCount: result.data['allTransactionsPaginated'].totalCount,
					limit: result.data['allTransactionsPaginated'].limit,
					offset: result.data['allTransactionsPaginated'].offset,
					isLoading: result.loading
				}))
			);
	}
}
