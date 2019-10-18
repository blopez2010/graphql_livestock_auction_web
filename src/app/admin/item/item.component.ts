import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PeopleService } from 'src/app/services/people.service';
import { Event, Item, Response } from '../../models';
import { ItemsService } from '../../services/items.service';
import { ItemFormComponent } from './item-form/item-form.component';
import { merge, of } from 'rxjs';
import { debounceTime, switchMap, startWith, map, catchError } from 'rxjs/operators';
import { PaginatedResponse } from 'src/app/models/paginatedResponse';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'lsa-item',
	templateUrl: './item.component.html',
	styleUrls: [ './item.component.scss' ]
})
export class ItemComponent implements OnInit {
	public displayedColumns: string[] = [ 'ordinal', 'ownerName', 'description', 'more' ];
	public dataSource: any = new MatTableDataSource<any>([]);
	public showSpinner = false;
	public isRateLimitReached = false;
	public totalCount = 0;
	public searchForm: FormGroup;
	public events: Event[];
	public activeEvent: string;

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

	@ViewChild(MatPaginator, { static: true })
	paginator: MatPaginator;

	@ViewChild('matAutocomplete', { static: true })
	matAutocomplete: MatAutocomplete;

	@ViewChild(MatSort, { static: true })
	sort: MatSort;

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
		this.showSpinner = itemsResult.isLoading;
		this.dataSource.paginator = this.paginator;
	}

	private updateSuccess(result: Response, successText: string) {
		const filter = this.dataSource.filter;
		this.showSpinner = result.isLoading;
		this.toastrService.success(successText);
		this.loadItemsData({
			data: this.itemsService.getCacheData(new Date(result.data.event.createdAt).getFullYear()),
			isLoading: false
		});
		this.searchEventChange(filter);
	}

	//#endregion

	ngOnInit() {
		this.searchForm = this.formBuilder.group({
			eventId: ''
		});
		this.selectedEventId = this.route.data['value']['activeEvent'].id;
		this.events = this.route.data['value']['events'];
		const resolvedActiveEvent = this.route.data['value']['activeEvent'];
		this.activeEvent = resolvedActiveEvent
			? `${resolvedActiveEvent.name} - ${new Date(resolvedActiveEvent.createdAt).getFullYear()}`
			: '';
		// this.showSpinner = true;
		// this.loadData(this.route.data['value']['activeEvent']);
	}

	// tslint:disable-next-line: use-lifecycle-interface
	public ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.searchForm.get('eventId').valueChanges.subscribe(() => (this.paginator.pageIndex = 0));

		merge(
			this.sort.sortChange,
			this.paginator.page,
			this.searchForm.get('eventId').valueChanges.pipe(debounceTime(300))
		)
			.pipe(
				startWith({ data: [], totalCount: 0, limit: 0, offset: 0, isLoading: false } as PaginatedResponse<Item>),
				switchMap(() => {
					this.showSpinner = true;
					return this.itemsService.getByEventPaginated(
						this.searchForm.get('eventId').value,
						this.dataSource.filter,
						this.sort.active || 'ordinal',
						this.sort.direction.toUpperCase() || 'ASC',
						this.paginator.pageIndex,
						this.paginator.pageSize
					);
				}),
				map((result) => {
					this.showSpinner = false;
					this.totalCount = result.totalCount;
					this.isRateLimitReached = false;
					return result.data;
				}),
				catchError((error) => {
					this.showSpinner = false;
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
	//#endregion
}
