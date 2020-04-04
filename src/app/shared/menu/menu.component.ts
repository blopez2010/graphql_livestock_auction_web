import { Component } from '@angular/core';

import { MenuOption } from './menu-option';

@Component({
  selector: 'lsa-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public menuOptions: MenuOption[] = [
    {
      name: 'Principal',
      route: '/home',
      icon: 'dashboard'
    },
    {
      name: 'Eventos',
      route: '/admin/events',
      icon: 'event'
    },
    {
      name: 'Personas',
      route: '/admin/people',
      icon: 'people'
    },
    {
      name: 'Items',
      route: '/admin/items',
      icon: 'list'
    },
    {
      name: 'Transacciones',
      route: '/transactions/list',
      icon: 'money'
    },
    {
      name: 'Subastar',
      route: '/transactions/auction',
      icon: 'add_shopping_cart'
    },
    {
			name: 'Reportes',
			route: '/reports/dashboard',
			icon: 'assignment'
		}
  ];
}
