import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  location = new google.maps.LatLng(45.65697878480382, 25.625067447038685);

  options = { animation: google.maps.Animation.BOUNCE };
}
