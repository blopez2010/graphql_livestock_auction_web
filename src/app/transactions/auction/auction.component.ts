import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ItemsService } from 'src/app/services/items.service';
import { PeopleService } from 'src/app/services/people.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Event, People, Response } from '../../models';
import { PeopleFormComponent } from 'src/app/components/people-form/people-form.component';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'lsa-auction',
	templateUrl: './auction.component.html',
	styleUrls: [ './auction.component.scss' ]
})
export class AuctionComponent implements OnInit {
	public auctionForm: FormGroup;
	showSpinner: boolean;
	selectedBuyer: any = {};
	public destroyed = new Subject<any>();
	public people: People[] = [];
	public countDown = 0;
	public totalCount = 0;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private itemsService: ItemsService,
		private peopleService: PeopleService,
		private toastrService: ToastrService,
		private transactionService: TransactionService,
		private dialog: MatDialog
	) {}

	private initForm() {
		this.auctionForm = this.formBuilder.group({
			item: this.formBuilder.group({
				id: null,
				eventId: this.route.data['value']['activeEvent'].id,
				ordinal: [ null, Validators.required ],
				description: null,
				ownerName: [ null, Validators.required ],
				nickname: null
			}),
			transaction: this.formBuilder.group({
				id: null,
				description: null,
				amount: [ null, Validators.required ],
				totalBuying: 0,
				countDown: 0,
				totalItemsCount: 0,
				totalCount: 0
			})
		});

		this.auctionForm.get('item').get('ordinal').valueChanges.subscribe((value) => {
			if (value) {
				this.itemsService.getByOrdinal(value, this.route.data['value']['activeEvent'].id).subscribe(
					(result: Response) => {
						this.auctionForm.get('item').patchValue({
							id: result.data['id'],
							description: result.data['description'],
							ownerName: result.data['owner']['name'],
							nickname: result.data['owner']['nickname']
						});
					},
					(err) => {
						this.auctionForm.get('item').patchValue({
							description: '',
							ownerName: '',
							nickname: ''
						});
					}
				);
			}
		});
	}

	private getTotalBuying() {
		this.transactionService.getTotalAmountByEvent(this.route.data['value']['activeEvent'].id).subscribe((result) => {
			this.auctionForm.get('transaction').get('totalBuying').setValue(result.data['total']);
		});
		this.getItemsCountDown();
		this.getTotalCount();
		this.auctionForm.get('transaction').get('totalCount').setValue(this.totalCount - this.countDown);
	}

	private getItemsCountDown() {
		this.itemsService.getItemsCountDown(this.route.data['value']['activeEvent'].id).subscribe((result) => {
			this.countDown = result.data['count'];
			this.auctionForm.get('transaction').get('countDown').setValue(result.data['count']);
		});
	}

	private getTotalCount() {
		this.itemsService.getTotalItems(this.route.data['value']['activeEvent'].id).subscribe((result) => {
			this.totalCount = result.data['count'];
			this.auctionForm.get('transaction').get('totalItemsCount').setValue(result.data['count']);
		});
	}

	ngOnInit() {
		this.initForm();
		this.people = this.route.data['value']['people'];
		this.getTotalBuying();
		this.getTotalCount();
	}

	public addPeople(data: People) {
		this.dialog
			.open(PeopleFormComponent, {
				disableClose: true,
				maxWidth: '30em'
			})
			.afterClosed()
			.subscribe((data) => {
				if (data) {
					this.peopleService.create(data).subscribe((result: Response) => {
						this.showSpinner = result.isLoading;
						this.toastrService.success('Persona agregada');
						this.selectedBuyer = {
							...result.data,
							fullName: result.data.nickname ? `${result.data.name} (${result.data.nickname})` : result.data.fullName
						};
						this.people.push(this.selectedBuyer);
					});
				}
			});
	}

	public selectedPeopleChange(data: People) {
		this.selectedBuyer = data;
	}

	/**
   * donate
   */
	public donate() {
		if (this.auctionForm.valid && this.selectedBuyer) {
			this.transactionService
				.donate({
					eventId: this.route.data['value']['activeEvent'].id,
					itemId: this.auctionForm.get('item').get('id').value,
					buyerId: this.selectedBuyer.id,
					description: this.auctionForm.get('transaction').get('description').value,
					amount: this.auctionForm.get('transaction').get('amount').value
				})
				.subscribe(
					() => {
						this.auctionForm.get('transaction').reset();
						this.toastrService.success('El ítem ha sido donado!');
						this.getTotalBuying();
					},
					() => this.toastrService.error('Error!')
				);
		} else {
			this.toastrService.warning('Faltan datos!');
		}
	}

	/**
   * buy
   */
	public buy() {
		if (this.auctionForm.valid && this.selectedBuyer) {
			this.transactionService
				.buy({
					eventId: this.route.data['value']['activeEvent'].id,
					itemId: this.auctionForm.get('item').get('id').value,
					buyerId: this.selectedBuyer.id,
					description: this.auctionForm.get('transaction').get('description').value,
					amount: this.auctionForm.get('transaction').get('amount').value
				})
				.subscribe(
					() => {
						this.auctionForm.reset();
						this.toastrService.success('El ítem ha sido comprado!');
						this.getTotalBuying();
					},
					() => this.toastrService.error('Error!')
				);
		} else {
			this.toastrService.warning('Faltan datos!');
		}
	}
}
