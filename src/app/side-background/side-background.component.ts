import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';

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

  ngAfterViewInit() {
    const world = new CANNON.World();
    world.gravity = new CANNON.Vec3(0, -0.005, 0);

    const width = this.mainContainer.nativeElement.clientWidth,
      height = this.mainContainer.nativeElement.scrollHeight;

    // init
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(230 / 255, 112 / 255, 147 / 255);

    // any lighting?
    const light = new THREE.AmbientLight(0xffffff, 3);
    scene.add(light);

    //loading model
    const loader = new GLTFLoader();

    const tanFOV = Math.tan(((Math.PI / 180) * camera.fov) / 2);
    const initialHeight = height;

    loader.load(
      'assets/3d_models/musical_note/BakedMusicalNote.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.0005, 0.0005, 0.0005);
        let musical_note = gltf.scene;

        scene.add(musical_note);

        // cannon.js
        const shape = new CANNON.Body({
          mass: 1,
          shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
          position: new CANNON.Vec3(0, 0, 0)
        });
        world.addBody(shape);

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setAnimationLoop(animation);

        this.mainContainer.nativeElement.appendChild(renderer.domElement);



        // animation
        const timeStep = 1 / 60;
        function animation(time: number) {
          world.step(timeStep);
          // mesh.rotation.x = time / 2000;
          // mesh.rotation.y = time / 1000;

          musical_note.position.copy(shape.position);
          musical_note.quaternion.copy(shape.quaternion);

          gltf.scene.rotation.x = time / 2000;
          gltf.scene.rotation.y = time / 1000;

          const mainContainer =
            document.getElementsByClassName('main-container')[0];

          // update scene size
          renderer.setSize(
            mainContainer.clientWidth,
            mainContainer.clientHeight
          );

          // update camera
          camera.aspect =
            mainContainer.clientWidth / mainContainer.clientHeight;
          camera.fov =
            (360 / Math.PI) *
            Math.atan(tanFOV * (mainContainer.clientHeight / initialHeight));

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
