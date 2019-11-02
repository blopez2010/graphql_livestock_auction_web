import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { empty, merge, Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import { Item } from 'src/app/models';
import { PaginatedResponse } from 'src/app/models/paginatedResponse';
import { TransactionService } from 'src/app/services/transaction.service';

interface Filter {
	value: any;
	event: Observable<any>;
}

@Component({
	selector: 'lsa-transactions',
	templateUrl: './transactions.component.html',
	styleUrls: [ './transactions.component.scss' ]
})
export class TransactionsComponent implements OnInit {
	public displayedColumns: string[] = [
		'itemOrdinal',
		'ownerName',
		'buyerName',
		'description',
		'amount',
		'isDonated',
		'isPayed',
		'isLastBuyer',
		'paymentMethod',
		'paymentReference',
		'paymentDate',
		'more'
	];
	public totalCount = 0;
	public dataSource: any = new MatTableDataSource<any>([]);

	@ViewChild(MatPaginator, { static: true })
	public paginator: MatPaginator;

	@ViewChild(MatSort, { static: true })
	public sort: MatSort;
	// tslint:disable-next-line: deprecation
	private filters: Filter = { event: empty(), value: null };
	private startWithPipe = startWith({
		data: [],
		totalCount: 0,
		limit: 0,
		offset: 0,
		isLoading: false
	} as PaginatedResponse<Item>);

	private switchMapPipe = switchMap(() => {
		// let sortByColumn = 'ordinal';
		// if (this.sort.active && this.sort.active === 'ownerName') {
		// 	sortByColumn = 'people.name';
		// }
		return this.transactionService.getPaginated(
			this.filters.value || {},
			this.sort.active || 'itemOrdinal',
			this.sort.direction.toUpperCase() || 'ASC',
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
	});

	private mapPipe = map((result: any) => {
		this.totalCount = result.totalCount;
		return result.data;
	});

	private catchErrorPipe = catchError(() => {
		return of([]);
	});

	private filterPipe = filter(() => {
		return !(
			this.filters.value &&
			Object.entries(this.filters.value).length !== 0 &&
			this.filters.value.constructor === Object
		);
	});

	constructor(private transactionService: TransactionService) {}

	public ngOnInit() {}

	public search(filters) {
		this.filters.value = filters;
		this.paginator.pageIndex = 0;

		of(filters)
			.pipe(this.filterPipe, this.startWithPipe, this.switchMapPipe, this.mapPipe, this.catchErrorPipe)
			.subscribe((data: any) => {
				this.dataSource = new MatTableDataSource<any>(data);
			});
		// this.form.get('filters').setValue(filters);
	}

	/**
	 * pay
	 */
	public pay() {}

	// tslint:disable-next-line: use-life-cycle-interface
	public ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(this.switchMapPipe, this.mapPipe, this.catchErrorPipe)
			.subscribe((data: any) => {
				this.dataSource = new MatTableDataSource<any>(data);
			});
	}
}
