import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';

export const routes: Routes = [
  { path: 'evenimente', component: EventsComponent },
  { path: '**', component: HomeComponent }
];
