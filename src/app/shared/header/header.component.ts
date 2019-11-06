import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../session.service';

@Component({
  selector: 'lsa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router, private sessionService: SessionService) {}

  public exit() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  public get hasLoggedIn(): boolean {
    return this.sessionService.isLoggedIn;
  }
}
