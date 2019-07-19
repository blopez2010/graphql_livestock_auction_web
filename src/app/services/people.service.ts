import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { People } from '../models/people';
import { allPeople } from '../shared/queries';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private apollo: Apollo) {}

  public getPeople(): Observable<People[]> {
    return this.apollo
      .query({
        query: allPeople
      })
      .pipe(map(result => result.data['allPeople']));
  }
}
