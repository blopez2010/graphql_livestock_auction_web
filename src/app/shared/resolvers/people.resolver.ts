import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PeopleService } from 'src/app/services/people.service';
import { People, Response } from '../../models';

@Injectable()
export class PeopleResolver implements Resolve<People> {
  constructor(private peopleService: PeopleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): People | Observable<People> | Promise<People> {
    return this.peopleService
      .get()
      .pipe(switchMap(({ data }: Response) => of(data)));
  }
}
