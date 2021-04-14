import {
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// initialize script globals
const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
const orbitControls = new OrbitControls(camera, renderer.domElement);

function main(): void {
  // renderer
  renderer.setClearColor(0xffffff);

  // camera
  camera.position.set(10, 10, 10);
  camera.lookAt(scene.position);

  // helpers
  scene.add(new AxesHelper(10));

  // objects
  const cube = new Mesh(
    new BoxGeometry(5, 5, 5),
    new MeshBasicMaterial({ color: 0xf9008a, wireframe: true })
  );
  cube.position.set(-5, 3, 5);
  scene.add(cube);

  const sphere = new Mesh(
    new SphereGeometry(5, 10, 10),
    new MeshBasicMaterial({ color: 0x008af9, wireframe: true })
  );
  sphere.position.set(10, 5, -5);
  scene.add(sphere);

  const plane = new Mesh(
    new PlaneGeometry(40, 40),
    new MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true })
  );
  plane.rotation.set(MathUtils.degToRad(-90), 0, 0);
  plane.position.set(0, 0, 0);
  scene.add(plane);

  // light
  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(4, 4, 4);
  light.lookAt(0, 0, 0);
  scene.add(light);

  // startup sequence
  function init(): void {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  }

  // per-frame render call
  function render(): void {
    orbitControls.update();
    renderer.render(scene, camera);
  }

  // animation call via the Browser API
  function animate(): void {
    requestAnimationFrame(animate);
    render();
  }

  // run the application
  init();
  animate();
}

main();
