import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  allItems,
  getItemById,
  getItemsByEvent
} from '../graphql/types-definitions';
import { Item, Response } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(private apollo: Apollo) {}

  /**
   * getPeopleIdFromCache
   */
  public getItemIdFromCache(id: string): Observable<Item> {
    const people = this.apollo.getClient().readFragment({
      id,
      fragment: getItemById
    });

    return people;
  }

  public get(): Observable<Response> {
    return this.apollo
      .query({
        query: allItems
      })
      .pipe(
        map(result => ({
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
        map(result => ({
          data: result.data['getItemsByEvent'],
          isLoading: result.loading
        }))
      );
  }
}
