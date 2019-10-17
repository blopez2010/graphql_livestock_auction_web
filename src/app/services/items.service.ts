import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	allItems,
	getItemById,
	getItemByOrdinal,
	getItemsByEvent,
	getItemsCountDown,
	getTotalItems,
	getItemsByEventPaginated
} from '../graphql/types-definitions';
import { createItem, updateItem, updateItemById } from '../graphql/types-definitions/items/mutations';
import { Item, Response } from '../models';
import { PaginatedResponse } from '../models/paginatedResponse';

@Injectable({
	providedIn: 'root'
})
export class ItemsService {
	constructor(private apollo: Apollo) {}

	public getItemIdFromCache(id: string): Observable<Item> {
		const item = this.apollo.getClient().readFragment({
			id,
			fragment: getItemById
		});

		return item;
	}

	public getCacheData(year: number) {
		return this.apollo.getClient().readQuery({ query: getItemsByEvent, variables: { year } })['getItemsByEvent'];
	}

	public get(): Observable<Response> {
		return this.apollo
			.query({
				query: allItems
			})
			.pipe(
				map((result) => ({
					data: result.data['allItems'],
					isLoading: result.loading
				}))
			);
	}

	public getByEvent(year: number): Observable<Response> {
		return this.apollo
			.query({
				query: getItemsByEvent,
				variables: {
					year
				}
			})
			.pipe(
				map((result) => ({
					data: result.data['getItemsByEvent'],
					isLoading: result.loading
				}))
			);
	}

	public getByEventPaginated(
		eventId: string,
		filter: string,
		sortColumn: string,
		sortDirection: string,
		offset: number,
		limit: number
	): Observable<PaginatedResponse<Item>> {
		return this.apollo
			.query({
				query: getItemsByEventPaginated,
				variables: {
					input: {
						eventId,
						filter,
						sortColumn,
						sortDirection,
						offset,
						limit
					}
				}
			})
			.pipe(
				map((result) => ({
					data: result.data['allItemsPaginated'].items,
					totalCount: result.data['allItemsPaginated'].totalCount,
					limit: result.data['allItemsPaginated'].limit,
					offset: result.data['allItemsPaginated'].offset,
					isLoading: result.loading
				}))
			);
	}

	public getTotalCountByEvent(eventId: string): Observable<Response> {
		return this.apollo
			.query({
				query: getTotalItems,
				variables: {
					eventId
				}
			})
			.pipe(
				map((result) => ({
					data: result.data['getTotalCount'],
					isLoading: result.loading
				}))
			);
	}

	public getByOrdinal(ordinal: number, eventId: string): Observable<Response> {
		return this.apollo
			.query({
				query: getItemByOrdinal,
				variables: {
					ordinal,
					eventId
				}
			})
			.pipe(
				map((result) => ({
					data: result.data['getItemByOrdinal'],
					isLoading: result.loading
				}))
			);
	}

	/**
   * getItemsCountDown
   */
	public getItemsCountDown(eventId: string) {
		return this.apollo
			.query({
				query: getItemsCountDown,
				variables: {
					eventId
				}
			})
			.pipe(
				map((result) => {
					return { data: result.data['getItemsCountDown'] };
				})
			);
	}

	/**
   * getItemsCountDown
   */
	public getTotalItems(eventId: string) {
		return this.apollo
			.query({
				query: getTotalItems,
				variables: {
					eventId
				}
			})
			.pipe(
				map((result) => {
					return { data: result.data['getTotalItems'] };
				})
			);
	}

	public create(item: any): Observable<Response> {
		return this.apollo
			.mutate({
				mutation: createItem,
				variables: {
					input: {
						...item,
						ownerId: item.ownerId.id,
						id: undefined
					}
				}
			})
			.pipe(
				map((result) => {
					const data = result.data['createItem'].data;
					this.apollo.getClient().writeQuery({
						query: getItemsByEvent,
						variables: {
							year: new Date(data.event.createdAt).getFullYear()
						},
						data: {
							getItemsByEvent: [
								...this.getCacheData(new Date(data.event.createdAt).getFullYear()),
								data
							]
						}
					});

					return {
						data,
						isLoading: result.loading
					};
				})
			);
	}

	update(item: any): Observable<Response> {
		return this.apollo
			.mutate({
				mutation: updateItem,
				variables: {
					id: item.id,
					input: {
						...item,
						ownerId: item.ownerId.id,
						id: undefined
					}
				}
			})
			.pipe(
				map((result) => {
					const data = result.data['updateItem'];
					this.apollo.getClient().writeFragment({
						id: item.id,
						fragment: updateItemById,
						data
					});

					return {
						data,
						isLoading: result.loading
					};
				})
			);
	}
}
