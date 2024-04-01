import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss',
})
export class NavigationMenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
      },
      {
        label: 'Despre noi',
        icon: 'pi pi-fw pi-users',
      },
      {
        label: 'Evenimente',
        icon: 'pi pi-fw pi-calendar',
        routerLink: '/evenimente',
      },
      {
        label: 'Contact',
        icon: 'pi pi-fw pi-user',
      }
    ];
  }
}
