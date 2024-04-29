import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CommonModule, CardModule, AnimateOnScrollModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  maxDelta = 0;
  moveCarouselInterval: any;
  private carouselAutoMoveAnimationDuration: number = 2000;
  direction = -1;
  filmBandHoles: Array<number> = [];

  ngOnInit() {
    this.maxDelta = document.getElementById('childrenCarousel')!.scrollWidth;
    const vminSize = Math.min(window.innerWidth, window.innerHeight) / 100;
    const numberOfHoles: number = Math.ceil(this.maxDelta / (6 * vminSize));
    for (let i = 0; i < numberOfHoles; ++i) {
      this.filmBandHoles.push(1);
    }
  }

  ngAfterViewInit(): void {
    this.moveCarouselInterval = setInterval(() => {
      this.slightlyMoveCarousel();
    }, this.carouselAutoMoveAnimationDuration);
  }

  startCarousel(event: MouseEvent) {
    let $carousel = document.getElementById('childrenCarousel');

    if (!$carousel) {
      return;
    }

    $carousel.dataset['mouseDownAt'] = event.pageX.toString();
  }

  stopCarousel() {
    let $carousel = document.getElementById('childrenCarousel');

    if (!$carousel) {
      return;
    }

    $carousel.dataset['mouseDownAt'] = '0';
    $carousel.dataset['prevPercentage'] = $carousel.dataset['percentage'];
  }

  @HostListener('document:mousemove', ['$event'])
  moveCarouselAfterMouse(event: MouseEvent) {
    let speedFactor: number = 0.05;
    let $carousel = document.getElementById('childrenCarousel');

    if (!$carousel) {
      return;
    }

    let mouseDownAt = Number($carousel.dataset['mouseDownAt']);

    if (mouseDownAt === 0) return;

    //calc next percentage
    const mouseDelta = mouseDownAt - event.pageX;

    if (Math.abs(mouseDelta) < 50) return;

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

    $carousel.dataset['percentage'] = String(nextPercentage);

    // $carousel.style.left = `${nextPercentage}%`;
    $carousel.animate(
      { left: `${nextPercentage}%` },
      { duration: 2400, fill: 'forwards' }
    );

    $carousel.dataset['prevPercentage'] = nextPercentage.toString();

    let images = $carousel.children;
    for (let i = 0; i < images.length; i++) {
      const image = images[i] as HTMLElement;
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

  slightlyMoveCarousel() {
    let speedFactor: number = 0.05;
    let $carousel = document.getElementById('childrenCarousel');

    if (!$carousel) {
      return;
    }

    let mouseDownAt = Number($carousel.dataset['mouseDownAt']);

    const percentage = 10 * this.direction;

    let nextPercentage =
      Number($carousel.dataset['prevPercentage']) + percentage;

    if (Number.isNaN(nextPercentage) || nextPercentage === undefined) {
      nextPercentage = 0;
      $carousel.dataset['prevPercentage'] = nextPercentage.toString();
      return;
    }

    //set borderlines
    const leftCoefficient =
      this.maxDelta / document.getElementById('unclickableCoat')!.clientWidth;
    const carouselPercentageGrow = -leftCoefficient * 100 + 100;

    //set right borderline
    const rightBorderLine = carouselPercentageGrow;

    nextPercentage = Math.max(rightBorderLine, nextPercentage);

    //set left borderline
    nextPercentage = Math.min(0, nextPercentage);

    $carousel.dataset['percentage'] = String(nextPercentage);
    $carousel.dataset['prevPercentage'] = nextPercentage.toString();

    $carousel.animate(
      { left: `${nextPercentage}%` },
      {
        duration: this.carouselAutoMoveAnimationDuration,
        fill: 'forwards',
        easing: 'ease-in-out',
      }
    );

    let normalisedPercentage = (nextPercentage / carouselPercentageGrow) * 100;
    if (normalisedPercentage === 0 || normalisedPercentage === 100) {
      this.direction *= -1;
    }

    let images = $carousel.children;
    for (let i = 0; i < images.length; i++) {
      const image = images[i] as HTMLElement;
      image.animate(
        {
          objectPosition: `${normalisedPercentage}% 50%`,
        },
        {
          duration: this.carouselAutoMoveAnimationDuration,
          fill: 'forwards',
        }
      );
    }
  }
}
