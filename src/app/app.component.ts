import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavigationMenuComponent } from "./navigation-menu/navigation-menu.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        RouterOutlet,
        ButtonModule,
        NavigationMenuComponent
    ]
})
export class AppComponent {
  title = 'doremi-app';
}
