import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { max } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  maxDelta = 0;

  ngOnInit() {
    this.maxDelta = document.getElementById('childrenCarousel')!.scrollWidth;
  }

  carouselMouseDown(event: MouseEvent) {
    let $carousel = document.getElementById('childrenCarousel');

    if (!$carousel) {
      return;
    }

    $carousel.dataset['mouseDownAt'] = event.pageX.toString();
  }

  carouselMouseUp(event: MouseEvent, speedFactor: number) {
    let $carousel = document.getElementById('childrenCarousel');

    if (!$carousel) {
      return;
    }

    //calc next percentage
    const mouseDelta = Number($carousel.dataset['mouseDownAt']) - event.pageX;
    const percentage = (mouseDelta / this.maxDelta) * -100 * speedFactor;

    let nextPercentage =
      Number($carousel.dataset['prevPercentage']) + percentage;

    //set borderlines
    const leftCoefficient =
      this.maxDelta / document.getElementById('unclickableCoat')!.clientWidth;
    const carouselPercentageGrow = -leftCoefficient * 100 + 100;

    //set right borderline
    const rightBorderLine = carouselPercentageGrow;
    nextPercentage = Math.max(rightBorderLine, nextPercentage);

    //set left borderline
    nextPercentage = Math.min(0, nextPercentage);

    // $carousel.style.left = `${nextPercentage}%`;
    $carousel.animate(
      { left: `${nextPercentage}%` },
      { duration: 1200, fill: 'forwards' }
    );

    $carousel.dataset['prevPercentage'] = nextPercentage.toString();

    let images = $carousel.children;
    for (let i = 0; i < images.length; i++) {
      const image = images[i] as HTMLElement;
      // image.style.objectPosition = `${nextPercentage/carouselPercentageGrow * 100}% 50%`;
      image.animate(
        {
          objectPosition: `${
            (nextPercentage / carouselPercentageGrow) * 100
          }% 50%`,
        },
        { duration: 1200, fill: 'forwards' }
      );
    }
  }
}
