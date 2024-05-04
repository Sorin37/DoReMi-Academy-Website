import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-side-background',
  standalone: true,
  imports: [],
  templateUrl: './side-background.component.html',
  styleUrl: './side-background.component.scss',
})
export class SideBackgroundComponent implements AfterViewInit {
  width: number = 0;
  height: number = 0;

  @ViewChild('mainContainer')
  mainContainer!: ElementRef;

  constructor(private el: ElementRef) {
    this.width = el.nativeElement.offsetWidth;
    this.height = el.nativeElement.offsetHeight;
  }
  ngAfterViewInit(): void {
    const width = this.width,
      height = this.height;

    // init

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(230/255, 112/255, 147/255);

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animation);
    this.mainContainer.nativeElement.appendChild(renderer.domElement);

    // animation

    function animation(time: number) {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;

      renderer.render(scene, camera);
    }
  }
}
