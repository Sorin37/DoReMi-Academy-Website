import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { SideBackgroundComponent } from '../side-background/side-background.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    GoogleMapsModule,
    AccordionModule,
    ButtonModule,
    CarouselModule,
    CardModule,
    SideBackgroundComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  location = new google.maps.LatLng(45.65697878480382, 25.625067447038685);

  options = { animation: google.maps.Animation.BOUNCE };

  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  images = [
    'Bookshelf.jpg',
    'Entrance.jpg',
    'HangerWelcome.jpg',
    'MusicalInstruments.jpg',
    'PaintingAndSlinky.jpg',
    'TableWithBoard.jpg',
    'TableWithPlanets.jpg',
    'Toys.jpg',
  ];

  download() {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/files/ContractEducationalDoReMi.docx';
    link.download = 'Contract educational DoReMi.docx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
