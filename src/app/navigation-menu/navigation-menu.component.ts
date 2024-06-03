import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss',
})
export class NavigationMenuComponent {
  closeMenu() {
    let menu = document.getElementsByClassName("popup-menu-container")[0] as HTMLElement
    menu.style.display = "none";
  }

  openMenu() {
    let menu = document.getElementsByClassName("popup-menu-container")[0] as HTMLElement
    menu.style.display = "block";
  }
}
