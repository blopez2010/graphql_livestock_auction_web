import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { People, Response } from '../../models';
import { ItemsService } from '../../services/items.service';

@Injectable()
export class ItemsResolver implements Resolve<People> {
	constructor(private itemsService: ItemsService) {}

	public resolve(route: ActivatedRouteSnapshot): People | Observable<People> | Promise<People> {
		return this.itemsService.getByEvent(new Date(route.data['value']['activeEvent']).getFullYear()).pipe(
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
