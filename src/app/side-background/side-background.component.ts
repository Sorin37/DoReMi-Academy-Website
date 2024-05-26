import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { create } from 'node:domain';

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
      let renderedObjects: Array<THREE.Group<THREE.Object3DEventMap>> = [];

      //obtain model dimensions
      let boundingBox = new THREE.Box3();
      boundingBox.setFromObject(musicalNoteModel);
      var modelWidth = boundingBox.max.x - boundingBox.min.x;
      var modelHeight = boundingBox.max.y - boundingBox.min.y;

      //create a line of notes
      createOddLine(
        musicalNoteModel,
        sceneWidth,
        sceneHeight,
        scene,
        modelWidth,
        modelHeight,
        renderedObjects
      );

      function animation(time: number) {
        //remove out of fov objects
        let i = 0;
        while (i < renderedObjects.length) {
          if (renderedObjects[i].position.y < -sceneHeight / 2 - modelHeight) {
            scene.remove(renderedObjects[i]);
            renderedObjects.splice(i, 1);
          } else {
            i++;
          }
        }

        //shift objects down
        renderedObjects.forEach((object) => {
          object.position.y -= 0.001;
        });

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

// function createNotesBatch(
//   renderedObjects: Array<any>,
//   sceneWidth: number,
//   sceneHeight: number,
//   world: CANNON.World,
//   scene: THREE.Scene,
//   numberOfNotes: number,
//   model: THREE.Group<THREE.Object3DEventMap>
// ) {
//   const currentNumberOfObjects = renderedObjects.length;
//   for (let i = 0; i < numberOfNotes; ++i) {
//     const musicalNoteClone = model.clone();
//     scene.add(musicalNoteClone);

//     const shape = new CANNON.Body({
//       mass: 1,
//       shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
//       position: new CANNON.Vec3(sceneWidth / 2, sceneHeight / 2, 0),
//     });
//     world.addBody(shape);

//     shape.collisionResponse = false;

//     //apply force
//     let lateralForce = THREE.MathUtils.randFloat(-1, 4);
//     let verticalForce = THREE.MathUtils.randFloat(-5, 5);
//     shape.applyForce(
//       new CANNON.Vec3(-1 * 5 + lateralForce, verticalForce, 0),
//       new CANNON.Vec3(0, 0, 0)
//     );

//     renderedObjects.push([musicalNoteClone, shape]);
//   }
// }

function createOddLine(
  model: THREE.Group<THREE.Object3DEventMap>,
  sceneWidth: number,
  sceneHeight: number,
  scene: THREE.Scene,
  modelWidth: number,
  modelHeight: number,
  renderedObjects: Array<THREE.Group<THREE.Object3DEventMap>>
) {
  let notesPerOddLine = sceneWidth / (4 * modelWidth);

  let middleNote = model.clone();
  scene.add(middleNote);
  middleNote.position.y = sceneHeight / 2 + modelHeight;

  renderedObjects.push(middleNote);

  for (let i = 1; i < notesPerOddLine + 1; ++i) {
    let leftNote = model.clone();
    scene.add(leftNote);

    leftNote.position.x -= modelWidth * 2;
    leftNote.position.y = sceneHeight / 2 + modelHeight;

    renderedObjects.push(leftNote);

    let rightNote = model.clone();
    scene.add(rightNote);

    rightNote.position.x += modelWidth * 2;
    rightNote.position.y = sceneHeight / 2 + modelHeight;

    renderedObjects.push(rightNote);
  }
}
