import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import EyeTexD from './assets/eye-diffuse.jpg';
import EyeTexN from './assets/eye-normal.jpg';
import EyeMesh from './assets/eye.fbx';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
let camera: THREE.Camera;
let controls: OrbitControls;

function resetCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 5;
  camera.lookAt(scene.position);

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function resetControls() {
  if (camera && !controls) {
    controls = new OrbitControls(camera, renderer.domElement);
  }
  controls.update();
}

const axis = new THREE.AxesHelper(10);
scene.add(axis);

const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(100, 100, 100);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
light2.position.set(-100, 100, -100);
scene.add(light2);

// add a model + textures
let eyeObject: THREE.Group;
const textureD = new THREE.TextureLoader().load(EyeTexD);
const textureN = new THREE.TextureLoader().load(EyeTexN);
const fbxLoader: FBXLoader = new FBXLoader();
fbxLoader.load(
  EyeMesh,
  (object) => {
    eyeObject = object;
    eyeObject.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const mat: THREE.Texture = o.material;
        // @ts-ignore
        mat.map = textureD;
        // @ts-ignore
        mat.normalMap = textureN;

        mat.needsUpdate = true;
      }
    });
    eyeObject.scale.set(0.01, 0.01, 0.01);
    scene.add(eyeObject);
  },
  (progress) =>
    console.log(`${(progress.loaded / progress.total) * 100}% loaded`),
  (error) => console.log(error)
);

function render(): void {
  const timer = 0.002 * Date.now();
  if (eyeObject) {
    eyeObject.position.y = 0.5 + 0.5 * Math.sin(timer);
    eyeObject.rotation.x += 0.01;
  }
  renderer.render(scene, camera);
}

function animate(): void {
  requestAnimationFrame(animate);
  render();
  if (controls) controls.update();
}

window.onresize = () => {
  resetCamera();
  resetControls();
};
resetCamera();
resetControls();

animate();
