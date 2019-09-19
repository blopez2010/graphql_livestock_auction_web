import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ItemsService } from 'src/app/services/items.service';
import { People, Response } from '../../models';

@Injectable()
export class ItemsResolver implements Resolve<People> {
  constructor(private itemsService: ItemsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): People | Observable<People> | Promise<People> {
    return this.itemsService
      .getByEvent(new Date(route.data['value']['activeEvent']).getFullYear())
      .pipe(
        switchMap(({ data }: Response) =>
          of(
            data.map((p: People) => ({
              ...p,
              fullName: p.nickname ? `${p.name} (${p.nickname})` : p.name
            }))
          )
        )
      );
  }
}
