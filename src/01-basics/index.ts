import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Tweakpane from 'tweakpane';

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
    new MeshLambertMaterial({ color: 0xf9008a })
  );
  cube.position.set(-5, 3, 5);
  scene.add(cube);

  const sphere = new Mesh(
    new SphereGeometry(5, 10, 10),
    new MeshLambertMaterial({ color: 0x008af9 })
  );
  sphere.position.set(10, 5, -5);
  scene.add(sphere);

  const plane = new Mesh(
    new PlaneGeometry(40, 40),
    new MeshLambertMaterial({ color: 0xaaaaaa })
  );
  plane.rotation.set(MathUtils.degToRad(-90), 0, 0);
  plane.position.set(0, 0, 0);
  scene.add(plane);

  // ambient light
  const ambientLight = new AmbientLight(0xffffff, 1 / 3);
  scene.add(ambientLight);

  // point light
  const pointLight = new PointLight(0xffffff, 1);
  pointLight.position.set(16, 16, 16);
  pointLight.lookAt(0, 0, 0);
  scene.add(pointLight);

  // startup sequence
  function init(): void {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // add tweakpane debugging UI
    const tp = new Tweakpane();
    tp.addInput(
      { 'Sphere XZ Plane': { x: sphere.position.x, y: sphere.position.z } },
      'Sphere XZ Plane',
      {
        x: { step: 0.01, min: -16, max: 16 },
        y: { step: 0.01, min: -16, max: 16 },
      }
    ).on('change', (e) =>
      sphere.position.set(e.value.x, sphere.position.y, e.value.y)
    );
    tp.addInput({ 'Point Light': pointLight.position }, 'Point Light', {
      x: { step: 0.5, min: -16, max: 16 },
      y: { step: 0.5, min: -16, max: 16 },
      z: { step: 0.5, min: -16, max: 16 },
    }).on('change', (e) =>
      pointLight.position.set(e.value.x, e.value.y, e.value.z)
    );
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
