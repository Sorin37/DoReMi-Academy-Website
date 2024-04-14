import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { AboutUsComponent } from './about-us/about-us.component';

export const routes: Routes = [
  { path: 'evenimente', component: EventsComponent },
  { path: 'despre-noi', component: AboutUsComponent },
  { path: '**', component: HomeComponent }
];
