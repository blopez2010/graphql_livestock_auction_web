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
      name: 'Personas',
      route: '/admin',
      icon: 'people'
    },
    {
      name: 'Items',
      route: 'items',
      icon: 'list'
    },
    {
      name: 'Transacciones',
      route: 'transactions',
      icon: 'money'
    },
    {
      name: 'Subastar',
      route: 'auction',
      icon: 'add_shopping_cart'
    }
  ];
}
