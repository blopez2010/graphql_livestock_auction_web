import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { empty, merge, Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import { Item, PaymentMethods, Transaction } from 'src/app/models';
import { PaginatedResponse } from 'src/app/models/paginatedResponse';
import { TransactionService } from 'src/app/services/transaction.service';

import { PayComponent } from '../pay/pay.component';

interface Filter {
  value: any;
  event: Observable<any>;
}

@Component({
  selector: 'lsa-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
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
  private resolvedActiveEvent: any = null;
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

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  public getReadablePaymentMethod(method: string): string {
    switch (method) {
      case PaymentMethods.CASH:
        return 'Efectivo';
      case PaymentMethods.DEPOSIT:
        return 'Depósito';
      case PaymentMethods.MONEY_CASH:
        return 'Cheque';
      default:
        return '';
    }
  }

  public ngOnInit() {
    this.resolvedActiveEvent = this.route.data['value']['activeEvent'] || { id: null };
  }

  public search(
    filters = {
      eventId: this.resolvedActiveEvent.id
    },
    page = 0
  ) {
    this.filters.value = filters;
    this.paginator.pageIndex = page;

    of(filters)
      .pipe(
        this.filterPipe,
        this.startWithPipe,
        this.switchMapPipe,
        this.mapPipe,
        this.catchErrorPipe
      )
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
      });
    // this.form.get('filters').setValue(filters);
  }

  /**
   * pay
   */
  public pay(transaction: Transaction) {
    this.dialog
      .open(PayComponent, {
        disableClose: true,
        maxWidth: '15em',
        data: {
          id: transaction.id,
          paymentMethod: transaction.paymentMethod,
          paymentReference: transaction.paymentReference,
          paymentDate: transaction.paymentDate
        }
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.transactionService.pay({ ...response, id: transaction.id }).subscribe((result) => {
            this.toastrService.success('La información del pago ha sido registrada.');
            this.search(this.filters.value, this.paginator.pageIndex);
          });
        }
      });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  public ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        this.switchMapPipe,
        this.mapPipe,
        this.catchErrorPipe
      )
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
      });
  }
}
