import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { merge, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';

import { Event, Item, Response } from '../../models';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { ItemsService } from '../../services/items.service';
import { PeopleService } from '../../services/people.service';
import { ItemFormComponent } from './item-form/item-form.component';

@Component({
	selector: 'lsa-item',
	templateUrl: './item.component.html',
	styleUrls: [ './item.component.scss' ]
})
export class ItemComponent implements OnInit {
	public displayedColumns: string[] = [ 'ordinal', 'ownerName', 'description', 'more' ];
	public dataSource: any = new MatTableDataSource<any>([]);
	public isRateLimitReached = false;
	public totalCount = 0;
	public searchForm: FormGroup;
	public events: Event[];
	public activeEvent: string;

	@ViewChild(MatPaginator, { static: true })
	public paginator: MatPaginator;

	@ViewChild('matAutocomplete', { static: true })
	public matAutocomplete: MatAutocomplete;

	@ViewChild(MatSort, { static: true })
	public sort: MatSort;

	private people: Response[];
	private selectedEventId: string;

	constructor(
		private dialog: MatDialog,
		private toastrService: ToastrService,
		private itemsService: ItemsService,
		private peopleService: PeopleService,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder
	) {}

	//#endregion

	public ngOnInit() {
		this.searchForm = this.formBuilder.group({
			eventId: '',
			filter: ''
		});
		this.selectedEventId = this.route.data['value']['activeEvent'].id;
		this.events = this.route.data['value']['events'];
		const resolvedActiveEvent = this.route.data['value']['activeEvent'];
		this.activeEvent = resolvedActiveEvent
			? `${resolvedActiveEvent.name} - ${new Date(resolvedActiveEvent.createdAt).getFullYear()}`
			: '';

		this.searchForm.get('eventId').setValue(this.activeEvent);
	}

	// tslint:disable-next-line: use-life-cycle-interface
	public ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.searchForm.valueChanges.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page, this.searchForm.valueChanges.pipe(debounceTime(300)))
			.pipe(
				startWith({ data: [], totalCount: 0, limit: 0, offset: 0, isLoading: false } as PaginatedResponse<Item>),
				switchMap(() => {
					let sortByColumn = 'ordinal';

					if (this.sort.active && this.sort.active === 'ownerName') {
						sortByColumn = 'people.name';
					}

					return this.itemsService.getByEventPaginated(
						this.searchForm.get('eventId').value,
						this.searchForm.get('filter').value,
						sortByColumn,
						this.sort.direction.toUpperCase() || 'ASC',
						this.paginator.pageIndex,
						this.paginator.pageSize
					);
				}),
				map((result) => {
					this.totalCount = result.totalCount;
					this.isRateLimitReached = false;
					return result.data;
				}),
				catchError(() => {
					this.isRateLimitReached = true;
					return of([]);
				})
			)
			.subscribe((data) => {
				this.dataSource = new MatTableDataSource<Item>(data);
			});
	}

	//#region Public methods
	public addItem() {
		this.dialog
			.open(ItemFormComponent, {
				disableClose: true,
				maxWidth: '30em',
				data: {
					eventId: this.selectedEventId,
					people: this.people
				}
			})
			.afterClosed()
			.subscribe((data) => {
				if (data) {
					this.itemsService.create(data).subscribe((result: Response) => this.updateSuccess(result, 'Item agregado'));
				}
			});
	}

	public editItem(item: Item) {
		const dataCached = this.peopleService.getPeopleIdFromCache(item.id);

		this.dialog
			.open(ItemFormComponent, {
				disableClose: true,
				maxWidth: '30em',
				data: {
					eventId: this.selectedEventId,
					people: this.people,
					item: dataCached
				}
			})
			.afterClosed()
			.subscribe((data) => {
				if (data) {
					this.itemsService
						.update(data)
						.subscribe((result: Response) => this.updateSuccess(result, 'Item actualizado'));
				}
			});
	}

	public selectedEventChange(event: any) {
		this.searchForm.get('eventId').setValue(event.id);
	}

	public searchEventChange(text: string) {
		this.dataSource.filter = text.trim().toLowerCase();
	}

	//#region Private methods

	private getDisplayData(data: Item[]) {
		return data.map((d) => {
			let ownerName = d.owner.name;
			if (d.owner.nickname) {
				ownerName = `${d.owner.name} (${d.owner.nickname})`;
			}

			return {
				...d,
				ownerName,
				eventDescription: `${d.event.name} - ${new Date(d.event.createdAt).getFullYear()}`
			};
		});
	}

	private loadItemsData(itemsResult: Response) {
		const items = itemsResult.data.sort((a, b) => {
			if (b.ordinal > a.ordinal) {
				return -1;
			} else if (a.ordinal === b.ordinal) {
				return 0;
			}

			return 1;
		});
		this.dataSource = new MatTableDataSource<any>(this.getDisplayData(items));
		this.dataSource.paginator = this.paginator;
	}

	private updateSuccess(result: Response, successText: string) {
		const filter = this.dataSource.filter;
		this.toastrService.success(successText);
		this.loadItemsData({
			data: this.itemsService.getCacheData(new Date(result.data.event.createdAt).getFullYear()),
			isLoading: false
		});
		this.searchEventChange(filter);
	}
	//#endregion
}
