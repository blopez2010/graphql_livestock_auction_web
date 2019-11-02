import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Loader } from '../../models';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'lsa-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) {}

  public ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe((state: Loader) => {
      this.show = state.show;
    });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
