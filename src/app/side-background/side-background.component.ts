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
    musicalNotes(this.mainContainer);
  }
}

function musicalNotes(mainContainer: ElementRef) {
  const world = new CANNON.World();
  world.gravity = new CANNON.Vec3(0, -0.1, 0);

  const width = mainContainer.nativeElement.clientWidth,
    height = mainContainer.nativeElement.scrollHeight;

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
      let musicalNoteModel = gltf.scene;

      const vFOV = (camera.fov * Math.PI) / 180;
      const sceneHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
      const sceneWidth = sceneHeight * camera.aspect;

      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setAnimationLoop(animation);

      mainContainer.nativeElement.appendChild(renderer.domElement);

      // animation
      const timeStep = 1 / 60;

      // init objects and physics array
      const renderedObjects: Array<any> = [];

      const maxNumberOfObjects = 10;

      function animation(time: number) {
        world.step(timeStep);
        // mesh.rotation.x = time / 2000;
        // mesh.rotation.y = time / 1000;


        // create more objects if the target isnt reached
        if (renderedObjects.length < maxNumberOfObjects) {
          const currentNumberOfObjects = renderedObjects.length;
          for (
            let i = 0;
            i < maxNumberOfObjects - currentNumberOfObjects;
            ++i
          ) {
            const musicalNoteClone = musicalNoteModel.clone();
            scene.add(musicalNoteClone);

            const shape = new CANNON.Body({
              mass: 1,
              shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
              position: new CANNON.Vec3(sceneWidth / 2, sceneHeight / 2, 0),
            });
            world.addBody(shape);

            shape.collisionResponse = false;

            let randFloat = THREE.MathUtils.randFloat(0, 3);
            shape.applyForce(
              new CANNON.Vec3(-1 * 5 + randFloat, -2, 0),
              new CANNON.Vec3(0, 0, 0)
            );

            renderedObjects.push([musicalNoteClone, shape]);
          }
        }

        //update object physics
        renderedObjects.forEach((entry) => {
          entry[0].position.copy(entry[1].position);
          entry[0].quaternion.copy(entry[1].quaternion);
        });

        updateObjectsPhysics();

        // gltf.scene.rotation.x = time / 2000;
        // gltf.scene.rotation.y = time / 1000;

        const mainContainer =
          document.getElementsByClassName('main-container')[0];

        // update scene size
        renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);

        // update camera
        camera.aspect = mainContainer.clientWidth / mainContainer.clientHeight;
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

function updateObjectsPhysics() {}
