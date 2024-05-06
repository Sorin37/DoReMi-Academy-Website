import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { lights } from 'three/examples/jsm/nodes/lighting/LightsNode';

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

  ngAfterViewInit(): void {
    const width = this.mainContainer.nativeElement.clientWidth,
      height = this.mainContainer.nativeElement.scrollHeight;

    console.log(width, height);
    console.log(this.mainContainer);

    // init

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(230 / 255, 112 / 255, 147 / 255);

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // any lighting?
    const light = new THREE.AmbientLight(0xffffff, 3);
    scene.add(light);

    const tanFOV = Math.tan(((Math.PI / 180) * camera.fov) / 2);
    const initialHeight = height;

    //loading model
    const loader = new GLTFLoader();

    loader.load(
      'assets/3d_models/musical_note/BakedMusicalNote.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.0005, 0.0005, 0.0005);
        scene.add(gltf.scene);

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setAnimationLoop(animation);

        this.mainContainer.nativeElement.appendChild(renderer.domElement);

        // animation

        function animation(time: number) {
          // mesh.rotation.x = time / 2000;
          // mesh.rotation.y = time / 1000;

          gltf.scene.rotation.x = time / 2000;
          gltf.scene.rotation.y = time / 1000;

          const mainContainer =
            document.getElementsByClassName('main-container')[0];

          // update scene size
          renderer.setSize(
            mainContainer.clientWidth,
            mainContainer.clientHeight,
          );

          // update camera
          camera.aspect =
            mainContainer.clientWidth / mainContainer.clientHeight;
          camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (mainContainer.clientHeight/initialHeight));

          camera.updateProjectionMatrix();

          renderer.render(scene, camera);
        }
      },
      undefined,
      function (error) {
        console.error('Failed to load 3D model');
      }
    );
  }
}
